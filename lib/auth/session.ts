import { cookies } from "next/headers";
import { cache } from "react";
import { getDb, schema } from "../db";
import { eq, and, gt } from "drizzle-orm";
import { hashToken } from "./password";
import { fastCache } from "../cache";

const SESSION_COOKIE_NAME = "nfc_session";
const SESSION_EXPIRY_DAYS = 30;

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const db = await getDb();
  const rawToken = crypto.randomUUID() + "-" + crypto.randomUUID();
  const tokenHash = await hashToken(rawToken);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_EXPIRY_DAYS * 24 * 60 * 60;
  const sessionId = crypto.randomUUID();

  await db.insert(schema.sessions).values({
    id: sessionId,
    userId,
    tokenHash,
    expiresAt,
    ipAddress,
    userAgent,
    createdAt: now,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });

  return { sessionToken: rawToken, expiresAt };
}

export const getCurrentSession = cache(async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = await hashToken(token);
    const cacheKey = `session:${tokenHash}`;
    const cached = fastCache.get<any>(cacheKey);
    if (cached) return cached;

    const db = await getDb();
    const now = Math.floor(Date.now() / 1000);

    const [sessionRecord] = await db
      .select()
      .from(schema.sessions)
      .where(and(eq(schema.sessions.tokenHash, tokenHash), gt(schema.sessions.expiresAt, now)))
      .limit(1);

    if (!sessionRecord) return null;

    const effectiveUserId = sessionRecord.userId || (sessionRecord as any).user_id;
    const [user] = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        avatarUrl: schema.users.avatarUrl,
        emailVerifiedAt: schema.users.emailVerifiedAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, effectiveUserId))
      .limit(1);

    if (!user) return null;

    // Get primary workspace
    const [membership] = await db
      .select()
      .from(schema.workspaceMemberships)
      .where(eq(schema.workspaceMemberships.userId, user.id))
      .limit(1);

    let workspace = null;
    if (membership) {
      const effectiveWorkspaceId = membership.workspaceId || (membership as any).workspace_id;
      const [ws] = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.id, effectiveWorkspaceId))
        .limit(1);
      workspace = ws;
    }

    const sessionData = {
      user,
      session: sessionRecord,
      workspace,
      membershipRole: membership?.role || "owner",
    };

    // Cache in fast memory for 60 seconds
    fastCache.set(cacheKey, sessionData, 60);

    return sessionData;
  } catch (error) {
    console.error("Error retrieving current session:", error);
    return null;
  }
});

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const tokenHash = await hashToken(token);
      fastCache.delete(`session:${tokenHash}`);
      const db = await getDb();
      await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, tokenHash));
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error destroying session:", error);
  }
}
