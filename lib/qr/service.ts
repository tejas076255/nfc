import QRCode from "qrcode";
import { getDb, schema } from "../db";
import { eq, and } from "drizzle-orm";
import { fastCache, invalidateQrCache } from "../cache";

function generateQrToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return "q_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateQrPngDataUrl(url: string, size = 300): Promise<string> {
  return QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
}

export async function generateQrSvgString(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
}

export async function resolveQrRedirect(token: string) {
  const cacheKey = `qr:token:${token}`;
  const cached = fastCache.get<any>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const [qr] = await db
    .select({
      qr: schema.qrCodes,
      profile: schema.profiles,
    })
    .from(schema.qrCodes)
    .innerJoin(schema.profiles, eq(schema.qrCodes.profileId, schema.profiles.id))
    .where(eq(schema.qrCodes.token, token))
    .limit(1);

  if (!qr) return { status: "not_found" as const };
  if (!qr.qr.isActive) return { status: "disabled" as const };
  if (qr.profile.status !== "published") return { status: "profile_unpublished" as const };

  // Increment scan count in non-blocking background
  void (async () => {
    try {
      await db
        .update(schema.qrCodes)
        .set({ scanCount: qr.qr.scanCount + 1 })
        .where(eq(schema.qrCodes.id, qr.qr.id));
    } catch {}
  })();

  const result = {
    status: "active" as const,
    profileSlug: qr.profile.slug,
    profileId: qr.profile.id,
    workspaceId: qr.qr.workspaceId,
    qrId: qr.qr.id,
    campaign: qr.qr.campaign,
  };

  fastCache.set(cacheKey, result, 300);

  return result;
}

export async function getWorkspaceQrCodes(workspaceId: string) {
  const db = await getDb();
  return db
    .select({
      id: schema.qrCodes.id,
      token: schema.qrCodes.token,
      title: schema.qrCodes.title,
      campaign: schema.qrCodes.campaign,
      isActive: schema.qrCodes.isActive,
      scanCount: schema.qrCodes.scanCount,
      createdAt: schema.qrCodes.createdAt,
      profileId: schema.qrCodes.profileId,
      profileName: schema.profiles.name,
      profileSlug: schema.profiles.slug,
    })
    .from(schema.qrCodes)
    .innerJoin(schema.profiles, eq(schema.qrCodes.profileId, schema.profiles.id))
    .where(eq(schema.qrCodes.workspaceId, workspaceId))
    .orderBy(schema.qrCodes.createdAt);
}

export async function createTrackableQrCode(data: {
  workspaceId: string;
  profileId: string;
  title: string;
  campaign?: string;
}) {
  const db = await getDb();
  const token = generateQrToken();
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(schema.qrCodes).values({
    id,
    workspaceId: data.workspaceId,
    profileId: data.profileId,
    token,
    title: data.title,
    campaign: data.campaign || null,
    isActive: 1,
    scanCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  return { id, token };
}

export async function toggleQrCodeActive(qrId: string, workspaceId: string, isActive: boolean) {
  const db = await getDb();
  await db
    .update(schema.qrCodes)
    .set({
      isActive: isActive ? 1 : 0,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(and(eq(schema.qrCodes.id, qrId), eq(schema.qrCodes.workspaceId, workspaceId)));

  return { success: true };
}
