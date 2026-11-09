import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "production" ? "https://tapbez.in" : "http://localhost:3000");
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/callback/google`;

  if (error || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || "Google sign-in was cancelled")}`, request.url));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  const returnTo = cookieStore.get("google_oauth_return_to")?.value || "/dashboard";

  // Clean up state cookies
  cookieStore.delete("google_oauth_state");
  cookieStore.delete("google_oauth_return_to");

  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=Invalid+OAuth+state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=Google+OAuth+credentials+not+configured", request.url));
  }

  try {
    // Exchange code for token
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
      return NextResponse.redirect(new URL("/login?error=Failed+to+exchange+Google+token", request.url));
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string; id_token?: string };

    // Fetch user profile from Google
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
      return NextResponse.redirect(new URL("/login?error=No+email+provided+by+Google", request.url));
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

    // Create session
    await createSession(userId);

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (err: any) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "Authentication failed")}`, request.url));
  }
}
