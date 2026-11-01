import { getDb, schema } from "../db";
import { eq, and, count } from "drizzle-orm";
import { FullProfileSnapshot, IndustryType } from "./types";
import { INDUSTRY_TEMPLATES } from "./templates";
import { fastCache, invalidateProfileCache } from "../cache";

export async function getWorkspaceSubscriptionPlan(workspaceId: string) {
  const cacheKey = `plan:${workspaceId}`;
  const cached = fastCache.get<any>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const [sub] = await db
    .select({
      subscription: schema.subscriptions,
      plan: schema.plans,
    })
    .from(schema.subscriptions)
    .innerJoin(schema.plans, eq(schema.subscriptions.planId, schema.plans.id))
    .where(eq(schema.subscriptions.workspaceId, workspaceId))
    .limit(1);

  let result;
  if (!sub) {
    // Default to free
    result = {
      planCode: "free" as const,
      profileLimit: 1,
      status: "active",
      planName: "Free Digital Identity",
    };
  } else {
    result = {
      planCode: sub.plan.code,
      profileLimit: sub.plan.profileLimit,
      status: sub.subscription.status,
      planName: sub.plan.name,
    };
  }

  fastCache.set(cacheKey, result, 120);
  return result;
}

export async function getWorkspaceProfiles(workspaceId: string) {
  const db = await getDb();
  return db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.workspaceId, workspaceId))
    .orderBy(schema.profiles.createdAt);
}

export async function getProfileById(profileId: string, workspaceId: string) {
  const db = await getDb();
  const [profile] = await db
    .select()
    .from(schema.profiles)
    .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.workspaceId, workspaceId)))
    .limit(1);

  if (!profile) return null;

  const blocks = await db
    .select()
    .from(schema.profileBlocks)
    .where(eq(schema.profileBlocks.profileId, profileId))
    .orderBy(schema.profileBlocks.sortOrder);

  let themeConfig = {};
  try {
    themeConfig = JSON.parse(profile.themeConfig);
  } catch {
    themeConfig = INDUSTRY_TEMPLATES[profile.industry as IndustryType]?.defaultTheme || {};
  }

  const parsedBlocks = blocks.map((b) => {
    let data = {};
    try {
      data = JSON.parse(b.blockData || "{}");
    } catch {
      data = {};
    }
    return {
      id: b.id,
      type: b.type as any,
      isEnabled: Boolean(b.isEnabled),
      sortOrder: b.sortOrder,
      blockData: data,
    };
  });

  // Auto-heal fallback: If profile has 0 blocks in DB, generate and persist default blocks from template
  if (parsedBlocks.length === 0) {
    const template = INDUSTRY_TEMPLATES[profile.industry as IndustryType] || INDUSTRY_TEMPLATES.professional;
    const now = Math.floor(Date.now() / 1000);
    const fallbackBlocks = template.defaultBlocks.map((b, i) => {
      const blockData = { ...b.blockData };
      if (b.type === "identity_header") {
        blockData.name = profile.name;
        if (profile.title) blockData.title = profile.title;
      }
      return {
        id: crypto.randomUUID(),
        profileId: profile.id,
        type: b.type,
        isEnabled: b.isEnabled ? 1 : 0,
        sortOrder: i,
        blockData: JSON.stringify(blockData),
      };
    });

    try {
      for (const fb of fallbackBlocks) {
        await db.insert(schema.profileBlocks).values({
          ...fb,
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (healErr) {
      console.error("Auto-heal insert failed:", healErr);
    }

    return {
      ...profile,
      themeConfig,
      blocks: fallbackBlocks.map((fb) => ({
        id: fb.id,
        type: fb.type as any,
        isEnabled: Boolean(fb.isEnabled),
        sortOrder: fb.sortOrder,
        blockData: JSON.parse(fb.blockData),
      })),
    };
  }

  return {
    ...profile,
    themeConfig,
    blocks: parsedBlocks,
  };
}

export async function createProfile(
  workspaceId: string,
  data: {
    name: string;
    industry: IndustryType;
    slug?: string;
    title?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    company?: string;
    isEmployee?: boolean;
  }
) {
  const db = await getDb();
  const template = INDUSTRY_TEMPLATES[data.industry] || INDUSTRY_TEMPLATES.professional;

  // Enforce workspace plan profile creation quota
  const planInfo = await getWorkspaceSubscriptionPlan(workspaceId);
  const [existingProfiles] = await db
    .select({ count: count() })
    .from(schema.profiles)
    .where(eq(schema.profiles.workspaceId, workspaceId));

  const currentCount = existingProfiles?.count || 0;
  if (currentCount >= planInfo.profileLimit) {
    throw new Error(
      `PLAN_LIMIT_REACHED: Your ${planInfo.planName} allows up to ${planInfo.profileLimit} profile(s). You currently have ${currentCount} profile(s). Please upgrade your plan in Billing to create more profiles.`
    );
  }

  // If creating an employee/team profile, inherit company details and branding from existing primary profile
  let inheritedTheme = template.defaultTheme;
  let inheritedCompany = data.company || "";
  let inheritedLogo = "";

  const [primaryExisting] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.workspaceId, workspaceId))
    .limit(1);

  if (primaryExisting) {
    try {
      inheritedTheme = { ...template.defaultTheme, ...(JSON.parse(primaryExisting.themeConfig || "{}")) };
    } catch {}

    const [headerBlockRow] = await db
      .select()
      .from(schema.profileBlocks)
      .where(and(eq(schema.profileBlocks.profileId, primaryExisting.id), eq(schema.profileBlocks.type, "identity_header")))
      .limit(1);

    if (headerBlockRow?.blockData) {
      try {
        const parsed = JSON.parse(headerBlockRow.blockData);
        if (!inheritedCompany && parsed.company) inheritedCompany = parsed.company;
        if (parsed.logoUrl) inheritedLogo = parsed.logoUrl;
      } catch {}
    }
  }

  const profileId = crypto.randomUUID();
  const baseSlug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const slug = `${baseSlug || "profile"}-${randomSuffix}`;
  const now = Math.floor(Date.now() / 1000);

  // Insert profile in Draft status
  await db.insert(schema.profiles).values({
    id: profileId,
    workspaceId,
    slug,
    name: data.name,
    title: data.title || (template.defaultBlocks[0]?.blockData as any)?.title || "",
    bio: (template.defaultBlocks[2]?.blockData as any)?.bio || "",
    industry: data.industry,
    templateId: template.id,
    themeConfig: JSON.stringify(inheritedTheme),
    status: "draft",
    searchIndexed: 0,
    fallbackPreference: 0,
    createdAt: now,
    updatedAt: now,
  });

  // Insert default blocks customized with user's/employee's details
  for (let i = 0; i < template.defaultBlocks.length; i++) {
    const block = template.defaultBlocks[i];
    const blockData = { ...block.blockData };
    if (block.type === "identity_header") {
      blockData.name = data.name;
      if (data.title) blockData.title = data.title;
      if (inheritedCompany) blockData.company = inheritedCompany;
      if (inheritedLogo) blockData.logoUrl = inheritedLogo;
      if (data.isEmployee) blockData.badge = "Team Member";
    } else if (block.type === "contact_actions") {
      if (data.phone) blockData.phone = data.phone;
      if (data.email) blockData.email = data.email;
      if (data.whatsapp) blockData.whatsapp = data.whatsapp;
    }
    await db.insert(schema.profileBlocks).values({
      id: crypto.randomUUID(),
      profileId,
      type: block.type,
      isEnabled: block.isEnabled ? 1 : 0,
      sortOrder: i,
      blockData: JSON.stringify(blockData),
      createdAt: now,
      updatedAt: now,
    });
  }

  return { id: profileId, slug };
}

export async function updateProfileDraft(
  profileId: string,
  workspaceId: string,
  data: {
    name?: string;
    slug?: string;
    title?: string;
    bio?: string;
    industry?: IndustryType;
    templateId?: string;
    themeConfig?: Record<string, any>;
    blocks?: Array<{ id?: string; type: string; isEnabled: boolean; sortOrder: number; blockData: Record<string, any> }>;
    searchIndexed?: boolean;
    fallbackPreference?: boolean;
  }
) {
  const db = await getDb();
  const [existing] = await db
    .select()
    .from(schema.profiles)
    .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.workspaceId, workspaceId)))
    .limit(1);

  if (!existing) {
    throw new Error("Profile not found or access denied");
  }

  const now = Math.floor(Date.now() / 1000);

  // If slug is changed, check uniqueness
  if (data.slug && data.slug !== existing.slug) {
    const cleanSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const [conflict] = await db
      .select({ id: schema.profiles.id })
      .from(schema.profiles)
      .where(eq(schema.profiles.slug, cleanSlug))
      .limit(1);

    if (conflict && conflict.id !== profileId) {
      throw new Error("This public slug is already taken. Please choose another.");
    }
  }

  // Update profile record
  await db
    .update(schema.profiles)
    .set({
      ...(data.name ? { name: data.name } : {}),
      ...(data.slug ? { slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "") } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.industry ? { industry: data.industry } : {}),
      ...(data.templateId ? { templateId: data.templateId } : {}),
      ...(data.themeConfig ? { themeConfig: JSON.stringify(data.themeConfig) } : {}),
      ...(data.searchIndexed !== undefined ? { searchIndexed: data.searchIndexed ? 1 : 0 } : {}),
      ...(data.fallbackPreference !== undefined ? { fallbackPreference: data.fallbackPreference ? 1 : 0 } : {}),
      updatedAt: now,
    })
    .where(eq(schema.profiles.id, profileId));

  // Update blocks if provided
  if (data.blocks && data.blocks.length > 0) {
    // Prepare all rows first with clean UUIDs and safe JSON serialization
    const rowsToInsert = data.blocks.map((b, i) => {
      let serialized = "{}";
      try {
        serialized = typeof b.blockData === "string" ? b.blockData : JSON.stringify(b.blockData || {});
      } catch {
        serialized = "{}";
      }
      return {
        id: crypto.randomUUID(),
        profileId,
        type: b.type,
        isEnabled: b.isEnabled ? 1 : 0,
        sortOrder: i,
        blockData: serialized,
        createdAt: now,
        updatedAt: now,
      };
    });

    if (rowsToInsert.length > 0) {
      await db.delete(schema.profileBlocks).where(eq(schema.profileBlocks.profileId, profileId));
      for (const row of rowsToInsert) {
        await db.insert(schema.profileBlocks).values(row);
      }
    }
  }

  return { success: true };
}

export async function publishProfile(
  profileId: string,
  workspaceId: string,
  userId: string,
  options?: { unpublishOthers?: boolean }
) {
  const db = await getDb();
  const profile = await getProfileById(profileId, workspaceId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  const now = Math.floor(Date.now() / 1000);

  // If user opted to unpublish others to make room for this profile
  if (options?.unpublishOthers) {
    const publishedProfiles = await db
      .select({ id: schema.profiles.id, slug: schema.profiles.slug })
      .from(schema.profiles)
      .where(and(eq(schema.profiles.workspaceId, workspaceId), eq(schema.profiles.status, "published")));

    for (const p of publishedProfiles) {
      if (p.id !== profileId) {
        await db
          .update(schema.profiles)
          .set({ status: "unpublished", updatedAt: now })
          .where(eq(schema.profiles.id, p.id));
        invalidateProfileCache(p.slug, p.id);
      }
    }
  }

  // Enforce plan published profile limits
  const planInfo = await getWorkspaceSubscriptionPlan(workspaceId);
  const [publishedCount] = await db
    .select({ count: count() })
    .from(schema.profiles)
    .where(and(eq(schema.profiles.workspaceId, workspaceId), eq(schema.profiles.status, "published")));

  // If this profile is not already published, check if we exceed the limit
  if (profile.status !== "published" && (publishedCount?.count || 0) >= planInfo.profileLimit) {
    throw new Error(
      `PLAN_LIMIT_REACHED: Your ${planInfo.planName} allows up to ${planInfo.profileLimit} published profile(s). Please unpublish your existing profile first or upgrade your plan.`
    );
  }

  // Count existing versions
  const [versionCount] = await db
    .select({ count: count() })
    .from(schema.profileVersions)
    .where(eq(schema.profileVersions.profileId, profileId));

  const nextVersionNumber = (versionCount?.count || 0) + 1;
  const versionId = crypto.randomUUID();

  // Snapshot content
  const snapshot: FullProfileSnapshot = {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    title: profile.title || "",
    bio: profile.bio || "",
    industry: profile.industry as IndustryType,
    templateId: profile.templateId,
    themeConfig: profile.themeConfig as any,
    blocks: profile.blocks,
    searchIndexed: Boolean(profile.searchIndexed),
  };

  // Insert published snapshot
  await db.insert(schema.profileVersions).values({
    id: versionId,
    profileId,
    versionNumber: nextVersionNumber,
    content: JSON.stringify(snapshot),
    themeConfig: JSON.stringify(profile.themeConfig),
    publishedBy: userId,
    publishedAt: now,
  });

  // Atomically update profile pointer and status
  await db
    .update(schema.profiles)
    .set({
      status: "published",
      publishedVersionId: versionId,
      updatedAt: now,
    })
    .where(eq(schema.profiles.id, profileId));

  invalidateProfileCache(profile.slug, profileId);

  return { success: true, versionNumber: nextVersionNumber, slug: profile.slug };
}

export async function unpublishProfile(profileId: string, workspaceId: string) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  const [profile] = await db
    .select({ slug: schema.profiles.slug })
    .from(schema.profiles)
    .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.workspaceId, workspaceId)))
    .limit(1);

  await db
    .update(schema.profiles)
    .set({
      status: "unpublished",
      updatedAt: now,
    })
    .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.workspaceId, workspaceId)));

  invalidateProfileCache(profile?.slug, profileId);

  return { success: true };
}

export async function getPublishedProfileBySlug(slug: string): Promise<FullProfileSnapshot | null> {
  const cleanSlug = slug.toLowerCase();
  const cacheKey = `profile:slug:${cleanSlug}`;
  const cached = fastCache.get<FullProfileSnapshot>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const [profile] = await db
    .select()
    .from(schema.profiles)
    .where(and(eq(schema.profiles.slug, cleanSlug), eq(schema.profiles.status, "published")))
    .limit(1);

  if (!profile || !profile.publishedVersionId) return null;

  const [version] = await db
    .select()
    .from(schema.profileVersions)
    .where(eq(schema.profileVersions.id, profile.publishedVersionId))
    .limit(1);

  if (!version) return null;

  try {
    const snapshot = JSON.parse(version.content) as FullProfileSnapshot;
    snapshot.slug = profile.slug;
    // Cache for 300 seconds (5 mins) in fast worker memory
    fastCache.set(cacheKey, snapshot, 300);
    return snapshot;
  } catch (err) {
    console.error("Failed to parse published profile snapshot:", err);
    return null;
  }
}
