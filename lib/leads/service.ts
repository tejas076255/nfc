import { getDb, schema } from "../db";
import { eq, and, desc, like } from "drizzle-orm";

export interface CreateLeadInput {
  profileId: string;
  visitorName: string;
  phone: string;
  email?: string;
  message?: string;
  serviceInterest?: string;
  sourceType?: "nfc" | "qr" | "direct" | "campaign" | "unknown";
  sourceToken?: string;
  contactConsent: boolean;
  marketingConsent?: boolean;
  submissionKey?: string;
}

export async function createPublicLead(input: CreateLeadInput) {
  if (!input.contactConsent) {
    throw new Error("Contact sharing consent is required to submit your information.");
  }

  if (!input.visitorName?.trim() || !input.phone?.trim()) {
    throw new Error("Please provide your name and contact phone number.");
  }

  const db = await getDb();

  // Find profile to attribute workspace
  const [profile] = await db
    .select({ id: schema.profiles.id, workspaceId: schema.profiles.workspaceId, name: schema.profiles.name })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, input.profileId))
    .limit(1);

  if (!profile) {
    throw new Error("Associated profile could not be found.");
  }

  // Check idempotency key if provided
  const submissionKey = input.submissionKey || crypto.randomUUID();
  const [existingSubmission] = await db
    .select({ id: schema.leads.id })
    .from(schema.leads)
    .where(eq(schema.leads.submissionKey, submissionKey))
    .limit(1);

  if (existingSubmission) {
    return { id: existingSubmission.id, duplicate: true };
  }

  // Determine source card or QR if token provided
  let sourceCardId: string | null = null;
  let sourceQrId: string | null = null;
  let sourceType = input.sourceType || "direct";

  if (input.sourceToken) {
    if (input.sourceToken.startsWith("t_")) {
      const [card] = await db
        .select({ id: schema.cards.id })
        .from(schema.cards)
        .where(eq(schema.cards.publicToken, input.sourceToken))
        .limit(1);
      if (card) {
        sourceCardId = card.id;
        sourceType = "nfc";
      }
    } else if (input.sourceToken.startsWith("q_")) {
      const [qr] = await db
        .select({ id: schema.qrCodes.id })
        .from(schema.qrCodes)
        .where(eq(schema.qrCodes.token, input.sourceToken))
        .limit(1);
      if (qr) {
        sourceQrId = qr.id;
        sourceType = "qr";
      }
    }
  }

  const leadId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(schema.leads).values({
    id: leadId,
    workspaceId: profile.workspaceId,
    profileId: profile.id,
    visitorName: input.visitorName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    message: input.message?.trim() || null,
    serviceInterest: input.serviceInterest?.trim() || null,
    status: "new",
    sourceType,
    sourceCardId,
    sourceQrId,
    contactConsent: 1,
    contactConsentVersion: "v1",
    marketingConsent: input.marketingConsent ? 1 : 0,
    submissionKey,
    createdAt: now,
    updatedAt: now,
  });

  // Log lead status history
  await db.insert(schema.leadStatusHistory).values({
    id: crypto.randomUUID(),
    leadId,
    oldStatus: "none",
    newStatus: "new",
    changedBy: "system",
    createdAt: now,
  });

  // Log analytics event
  await db.insert(schema.analyticsEvents).values({
    id: crypto.randomUUID(),
    workspaceId: profile.workspaceId,
    profileId: profile.id,
    eventType: "lead_submitted",
    sourceToken: input.sourceToken || null,
    sourceType,
    timestamp: now,
  });

  // Trigger async background notification if Queue is bound
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    if ((ctx?.env as any)?.QUEUE) {
      await ((ctx.env as any).QUEUE as any).send({
        type: "lead.created",
        leadId,
        profileName: profile.name,
        visitorName: input.visitorName,
        phone: input.phone,
        email: input.email,
        timestamp: now,
      });
    }
  } catch {
    // Graceful background delivery in local dev
  }

  return { id: leadId, duplicate: false };
}

export async function getWorkspaceLeads(
  workspaceId: string,
  filters?: { status?: string; profileId?: string; search?: string }
) {
  const db = await getDb();
  const query = db
    .select({
      id: schema.leads.id,
      visitorName: schema.leads.visitorName,
      phone: schema.leads.phone,
      email: schema.leads.email,
      message: schema.leads.message,
      serviceInterest: schema.leads.serviceInterest,
      status: schema.leads.status,
      sourceType: schema.leads.sourceType,
      contactConsent: schema.leads.contactConsent,
      marketingConsent: schema.leads.marketingConsent,
      createdAt: schema.leads.createdAt,
      profileId: schema.leads.profileId,
      profileName: schema.profiles.name,
      cardToken: schema.cards.publicToken,
      qrToken: schema.qrCodes.token,
    })
    .from(schema.leads)
    .innerJoin(schema.profiles, eq(schema.leads.profileId, schema.profiles.id))
    .leftJoin(schema.cards, eq(schema.leads.sourceCardId, schema.cards.id))
    .leftJoin(schema.qrCodes, eq(schema.leads.sourceQrId, schema.qrCodes.id))
    .where(eq(schema.leads.workspaceId, workspaceId))
    .orderBy(desc(schema.leads.createdAt));

  const allLeads = await query;

  return allLeads.filter((lead) => {
    if (filters?.status && filters.status !== "all" && lead.status !== filters.status) return false;
    if (filters?.profileId && filters.profileId !== "all" && lead.profileId !== filters.profileId) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const match =
        lead.visitorName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.serviceInterest && lead.serviceInterest.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export async function updateLeadStatus(
  leadId: string,
  workspaceId: string,
  newStatus: "new" | "contacted" | "qualified" | "converted" | "closed",
  userId: string
) {
  const db = await getDb();
  const [lead] = await db
    .select()
    .from(schema.leads)
    .where(and(eq(schema.leads.id, leadId), eq(schema.leads.workspaceId, workspaceId)))
    .limit(1);

  if (!lead) throw new Error("Lead not found");

  const now = Math.floor(Date.now() / 1000);
  const oldStatus = lead.status;

  await db
    .update(schema.leads)
    .set({
      status: newStatus,
      updatedAt: now,
    })
    .where(eq(schema.leads.id, leadId));

  await db.insert(schema.leadStatusHistory).values({
    id: crypto.randomUUID(),
    leadId,
    oldStatus,
    newStatus,
    changedBy: userId,
    createdAt: now,
  });

  return { success: true };
}

export async function addLeadNote(leadId: string, workspaceId: string, authorId: string, content: string) {
  const db = await getDb();
  const [lead] = await db
    .select({ id: schema.leads.id })
    .from(schema.leads)
    .where(and(eq(schema.leads.id, leadId), eq(schema.leads.workspaceId, workspaceId)))
    .limit(1);

  if (!lead) throw new Error("Lead not found");

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(schema.leadNotes).values({
    id,
    leadId,
    authorId,
    content: content.trim(),
    createdAt: now,
  });

  return { id };
}

export async function getLeadDetails(leadId: string, workspaceId: string) {
  const db = await getDb();
  const [lead] = await db
    .select()
    .from(schema.leads)
    .where(and(eq(schema.leads.id, leadId), eq(schema.leads.workspaceId, workspaceId)))
    .limit(1);

  if (!lead) return null;

  const notes = await db
    .select({
      id: schema.leadNotes.id,
      content: schema.leadNotes.content,
      createdAt: schema.leadNotes.createdAt,
      authorName: schema.users.name,
    })
    .from(schema.leadNotes)
    .leftJoin(schema.users, eq(schema.leadNotes.authorId, schema.users.id))
    .where(eq(schema.leadNotes.leadId, leadId))
    .orderBy(desc(schema.leadNotes.createdAt));

  const history = await db
    .select({
      id: schema.leadStatusHistory.id,
      oldStatus: schema.leadStatusHistory.oldStatus,
      newStatus: schema.leadStatusHistory.newStatus,
      createdAt: schema.leadStatusHistory.createdAt,
      changedByName: schema.users.name,
    })
    .from(schema.leadStatusHistory)
    .leftJoin(schema.users, eq(schema.leadStatusHistory.changedBy, schema.users.id))
    .where(eq(schema.leadStatusHistory.leadId, leadId))
    .orderBy(desc(schema.leadStatusHistory.createdAt));

  return {
    ...lead,
    notes,
    history,
  };
}

export function exportLeadsToCsv(leads: Array<Record<string, any>>): string {
  const headers = [
    "ID",
    "Visitor Name",
    "Phone",
    "Email",
    "Status",
    "Service Interest",
    "Message",
    "Source Type",
    "Profile Name",
    "Contact Consent",
    "Marketing Consent",
    "Created Date",
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map((l) => [
    escapeCsv(l.id),
    escapeCsv(l.visitorName),
    escapeCsv(l.phone),
    escapeCsv(l.email || ""),
    escapeCsv(l.status),
    escapeCsv(l.serviceInterest || ""),
    escapeCsv(l.message || ""),
    escapeCsv(l.sourceType),
    escapeCsv(l.profileName || ""),
    escapeCsv(l.contactConsent ? "Yes" : "No"),
    escapeCsv(l.marketingConsent ? "Yes" : "No"),
    escapeCsv(new Date(l.createdAt * 1000).toISOString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
