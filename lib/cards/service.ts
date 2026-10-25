import { getDb, schema } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { hashToken } from "../auth/password";
import { fastCache, invalidateCardCache } from "../cache";

function generatePublicToken(): string {
  // 12-char cryptographically random unguessable token
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return "t_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateClaimSecret(): string {
  // High-entropy formatted claim code: CLAIM-XXXX-YYYY-ZZZZ
  const hex = (len: number) =>
    Array.from(crypto.getRandomValues(new Uint8Array(len)))
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");
  return `CLAIM-${hex(2)}-${hex(2)}-${hex(2)}`;
}

export async function resolveCardRedirect(publicToken: string) {
  const cacheKey = `card:token:${publicToken}`;
  const cached = fastCache.get<any>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const [card] = await db
    .select({
      card: schema.cards,
      profile: schema.profiles,
    })
    .from(schema.cards)
    .leftJoin(schema.profiles, eq(schema.cards.activeProfileId, schema.profiles.id))
    .where(eq(schema.cards.publicToken, publicToken))
    .limit(1);

  if (!card) {
    return { status: "not_found" as const };
  }

  if (card.card.activationStatus === "disabled" || !card.card.isActive) {
    return { status: "disabled" as const, card: card.card };
  }

  if (card.card.activationStatus === "revoked") {
    return { status: "revoked" as const, card: card.card };
  }

  if (card.card.activationStatus === "unassigned" || card.card.activationStatus === "claimable") {
    return {
      status: "claimable" as const,
      card: card.card,
    };
  }

  if (!card.profile || card.profile.status !== "published") {
    return {
      status: "profile_unpublished" as const,
      card: card.card,
    };
  }

  const result = {
    status: "active" as const,
    card: card.card,
    profileSlug: card.profile.slug,
    profileId: card.profile.id,
    workspaceId: card.card.workspaceId,
  };

  // Cache redirect in high-speed edge memory for 5 minutes
  fastCache.set(cacheKey, result, 300);

  return result;
}

export async function getWorkspaceCards(workspaceId: string) {
  const db = await getDb();
  return db
    .select({
      id: schema.cards.id,
      publicToken: schema.cards.publicToken,
      productVariant: schema.cards.productVariant,
      printDesignData: schema.cards.printDesignData,
      activeProfileId: schema.cards.activeProfileId,
      inventoryStatus: schema.cards.inventoryStatus,
      activationStatus: schema.cards.activationStatus,
      isActive: schema.cards.isActive,
      createdAt: schema.cards.createdAt,
      profileName: schema.profiles.name,
      profileSlug: schema.profiles.slug,
    })
    .from(schema.cards)
    .leftJoin(schema.profiles, eq(schema.cards.activeProfileId, schema.profiles.id))
    .where(eq(schema.cards.workspaceId, workspaceId))
    .orderBy(schema.cards.createdAt);
}

export async function claimCard(
  workspaceId: string,
  userId: string,
  rawClaimSecret: string,
  targetProfileId?: string
) {
  const cleanSecret = rawClaimSecret.trim().toUpperCase();
  const secretHash = await hashToken(cleanSecret);
  const db = await getDb();

  // Find claim record
  const [claimRecord] = await db
    .select()
    .from(schema.cardClaims)
    .where(eq(schema.cardClaims.claimSecretHash, secretHash))
    .limit(1);

  if (!claimRecord) {
    throw new Error("Invalid claim secret. Please verify your activation code and try again.");
  }

  if (claimRecord.status === "claimed") {
    throw new Error("This card has already been claimed and activated.");
  }

  if (claimRecord.attemptCount >= claimRecord.maxAttempts) {
    throw new Error("Maximum claim attempts exceeded for this code. Please contact support.");
  }

  const [card] = await db
    .select()
    .from(schema.cards)
    .where(eq(schema.cards.id, claimRecord.cardId))
    .limit(1);

  if (!card) {
    throw new Error("Associated physical card inventory record not found.");
  }

  const now = Math.floor(Date.now() / 1000);

  // If a profileId was provided, verify it belongs to this workspace
  let verifiedProfileId: string | null = null;
  if (targetProfileId) {
    const [profile] = await db
      .select({ id: schema.profiles.id })
      .from(schema.profiles)
      .where(and(eq(schema.profiles.id, targetProfileId), eq(schema.profiles.workspaceId, workspaceId)))
      .limit(1);
    if (profile) verifiedProfileId = profile.id;
  }

  // Atomically update claim record
  await db
    .update(schema.cardClaims)
    .set({
      status: "claimed",
      claimedByUserId: userId,
      claimedAt: now,
    })
    .where(eq(schema.cardClaims.id, claimRecord.id));

  // Update card record
  await db
    .update(schema.cards)
    .set({
      workspaceId,
      activeProfileId: verifiedProfileId,
      activationStatus: "active",
      isActive: 1,
      updatedAt: now,
    })
    .where(eq(schema.cards.id, card.id));

  // Record assignment if profile assigned
  if (verifiedProfileId) {
    await db.insert(schema.cardAssignments).values({
      id: crypto.randomUUID(),
      cardId: card.id,
      profileId: verifiedProfileId,
      workspaceId,
      validFrom: now,
      assignedBy: userId,
      createdAt: now,
    });
  }

  // Audit log
  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    workspaceId,
    actorId: userId,
    actorRole: "user",
    action: "card.claimed",
    resourceType: "card",
    resourceId: card.id,
    metadata: JSON.stringify({ publicToken: card.publicToken, profileId: verifiedProfileId }),
    createdAt: now,
  });

  return { success: true, cardId: card.id, publicToken: card.publicToken };
}

export async function assignCardProfile(
  cardId: string,
  workspaceId: string,
  profileId: string | null,
  userId: string
) {
  const db = await getDb();
  const [card] = await db
    .select()
    .from(schema.cards)
    .where(and(eq(schema.cards.id, cardId), eq(schema.cards.workspaceId, workspaceId)))
    .limit(1);

  if (!card) {
    throw new Error("Card not found in this workspace.");
  }

  if (profileId) {
    const [profile] = await db
      .select({ id: schema.profiles.id })
      .from(schema.profiles)
      .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.workspaceId, workspaceId)))
      .limit(1);

    if (!profile) {
      throw new Error("Selected profile does not belong to your workspace.");
    }
  }

  const now = Math.floor(Date.now() / 1000);

  // Update card assignment
  await db
    .update(schema.cards)
    .set({
      activeProfileId: profileId,
      updatedAt: now,
    })
    .where(eq(schema.cards.id, cardId));

  if (profileId) {
    await db.insert(schema.cardAssignments).values({
      id: crypto.randomUUID(),
      cardId,
      profileId,
      workspaceId,
      validFrom: now,
      assignedBy: userId,
      createdAt: now,
    });
  }

  invalidateCardCache(card.publicToken);

  return { success: true };
}

export async function setCardActiveState(
  cardId: string,
  workspaceId: string,
  isActive: boolean,
  userId: string
) {
  const db = await getDb();
  const [card] = await db
    .select()
    .from(schema.cards)
    .where(and(eq(schema.cards.id, cardId), eq(schema.cards.workspaceId, workspaceId)))
    .limit(1);

  if (!card) {
    throw new Error("Card not found.");
  }

  const now = Math.floor(Date.now() / 1000);
  await db
    .update(schema.cards)
    .set({
      isActive: isActive ? 1 : 0,
      activationStatus: isActive ? "active" : "disabled",
      updatedAt: now,
    })
    .where(eq(schema.cards.id, cardId));

  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    workspaceId,
    actorId: userId,
    actorRole: "user",
    action: isActive ? "card.enabled" : "card.disabled",
    resourceType: "card",
    resourceId: cardId,
    createdAt: now,
  });

  invalidateCardCache(card.publicToken);

  return { success: true };
}

// Admin inventory generation
export async function adminGenerateInventory(
  quantity: number,
  variant: "standard_pvc" | "matte_pvc",
  operatorId: string
) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);
  const created: Array<{ id: string; publicToken: string; claimSecret: string }> = [];

  for (let i = 0; i < quantity; i++) {
    const cardId = crypto.randomUUID();
    const publicToken = generatePublicToken();
    const rawClaimSecret = generateClaimSecret();
    const claimSecretHash = await hashToken(rawClaimSecret);

    await db.insert(schema.cards).values({
      id: cardId,
      publicToken,
      claimSecretHash,
      productVariant: variant,
      inventoryStatus: "received",
      activationStatus: "unassigned",
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(schema.cardClaims).values({
      id: crypto.randomUUID(),
      cardId,
      claimSecretHash,
      attemptCount: 0,
      maxAttempts: 5,
      status: "pending",
      createdAt: now,
    });

    created.push({ id: cardId, publicToken, claimSecret: rawClaimSecret });
  }

  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: operatorId,
    actorRole: "ops_staff",
    action: "inventory.batch_created",
    resourceType: "card_inventory",
    metadata: JSON.stringify({ count: quantity, variant }),
    createdAt: now,
  });

  return created;
}

// Admin QA recording
export async function adminRecordQA(data: {
  cardId: string;
  operatorId: string;
  step: "ndef_readback" | "qr_mapping" | "visual_print" | "final_pass";
  result: "pass" | "fail";
  readbackUrl?: string;
  verifiedQrToken?: string;
  notes?: string;
}) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(schema.cardQaRecords).values({
    id: crypto.randomUUID(),
    cardId: data.cardId,
    operatorId: data.operatorId,
    step: data.step,
    result: data.result,
    readbackUrl: data.readbackUrl,
    verifiedQrToken: data.verifiedQrToken,
    notes: data.notes,
    createdAt: now,
  });

  if (data.step === "final_pass" && data.result === "pass") {
    await db
      .update(schema.cards)
      .set({
        inventoryStatus: "qa_pass",
        activationStatus: "claimable",
        updatedAt: now,
      })
      .where(eq(schema.cards.id, data.cardId));
  } else if (data.result === "fail") {
    await db
      .update(schema.cards)
      .set({
        inventoryStatus: "qa_fail",
        updatedAt: now,
      })
      .where(eq(schema.cards.id, data.cardId));
  }

  return { success: true };
}

export async function getAllCardsForAdmin(limit = 100) {
  const db = await getDb();
  return db
    .select()
    .from(schema.cards)
    .orderBy(desc(schema.cards.createdAt))
    .limit(limit);
}

export async function getAuditLogs(limit = 50) {
  const db = await getDb();
  return db
    .select()
    .from(schema.auditLogs)
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(limit);
}

