import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { verifySignedOAuthState, getCanonicalGoogleRedirectUri } from "@/lib/auth/google";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const host = request.headers.get("host");
  const redirectUri = getCanonicalGoogleRedirectUri(request.url, host);

  if (error || !code) {
    const errorMsg = error || "Google sign-in was cancelled";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMsg)}`, request.url));
  }

  // Dual-layer state verification: Primary via signed HMAC state, Secondary via state cookie
  const signedStateResult = verifySignedOAuthState(state);
  let cookieState: string | undefined;

  try {
    const cookieStore = await cookies();
    cookieState = cookieStore.get("google_oauth_state")?.value;
    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_oauth_return_to");
  } catch (err) {
    console.warn("Could not read or delete state cookie:", err);
  }

  const isStateValid = signedStateResult.valid || (cookieState && state === cookieState);
  if (!isStateValid) {
    console.warn("OAuth state validation failed. State:", state, "Signed valid:", signedStateResult.valid, "Cookie state:", cookieState);
    return NextResponse.redirect(new URL("/login?error=OAuth+session+expired.+Please+try+signing+in+again.", request.url));
  }

  const returnTo = signedStateResult.returnTo || "/dashboard";

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth client credentials missing in server environment");
    return NextResponse.redirect(new URL("/login?error=Google+OAuth+credentials+not+configured+on+server", request.url));
  }

  try {
    // 1. Exchange code for OAuth access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Google token exchange error:", errText);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Google token exchange failed: " + errText)}`, request.url));
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string; id_token?: string };

    // 2. Fetch user profile from Google UserInfo
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userinfoResponse.ok) {
      return NextResponse.redirect(new URL("/login?error=Failed+to+fetch+user+profile+from+Google", request.url));
    }

    const googleUser = (await userinfoResponse.json()) as {
      sub: string;
      email: string;
      name?: string;
      picture?: string;
      email_verified?: boolean;
    };

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=No+email+provided+by+Google+account", request.url));
    }

    const email = googleUser.email.toLowerCase().trim();
    const name = googleUser.name || email.split("@")[0] || "User";
    const avatarUrl = googleUser.picture || null;
    const now = Math.floor(Date.now() / 1000);

    const db = await getDb();
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      if (!existingUser.avatarUrl && avatarUrl) {
        await db.update(schema.users).set({ avatarUrl, updatedAt: now }).where(eq(schema.users.id, userId));
      }
    } else {
      userId = crypto.randomUUID();
      const userCount = await db.select({ id: schema.users.id }).from(schema.users).limit(2);
      const role = userCount.length === 0 ? "super_admin" : "user";
      const randomPasswordHash = await hashPassword(crypto.randomUUID() + crypto.randomUUID());

      await db.insert(schema.users).values({
        id: userId,
        email,
        name,
        passwordHash: randomPasswordHash,
        role,
        avatarUrl,
        emailVerifiedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. CRITICAL: Guarantee user has a workspace and workspace membership
    const [existingMembership] = await db
      .select()
      .from(schema.workspaceMemberships)
      .where(eq(schema.workspaceMemberships.userId, userId))
      .limit(1);

    if (!existingMembership) {
      const workspaceId = crypto.randomUUID();
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const workspaceSlug = `${baseSlug || "workspace"}-${randomSuffix}`;

      await db.insert(schema.workspaces).values({
        id: workspaceId,
        name: `${name}'s Workspace`,
        slug: workspaceSlug,
        type: "personal",
        ownerId: userId,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(schema.workspaceMemberships).values({
        id: crypto.randomUUID(),
        workspaceId,
        userId,
        role: "owner",
        status: "active",
        createdAt: now,
      });

      const oneYearLater = now + 365 * 24 * 60 * 60;
      await db.insert(schema.subscriptions).values({
        id: crypto.randomUUID(),
        workspaceId,
        planId: "plan_free",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: oneYearLater,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 4. Create session and set session cookie
    await createSession(userId);

    // 5. Clean redirect to target destination
    const destination = returnTo && returnTo.startsWith("/") ? returnTo : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err?.message || "Authentication failed")}`, request.url));
  }
}
