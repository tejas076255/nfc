import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSignedOAuthState, getCanonicalGoogleRedirectUri } from "@/lib/auth/google";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google Client ID is not configured in environment" }, { status: 500 });
  }

  const host = request.headers.get("host");
  const redirectUri = getCanonicalGoogleRedirectUri(request.url, host);

  // Cryptographically signed state token carrying returnTo and timestamp
  const state = createSignedOAuthState(returnTo);

  // Also set cookie as secondary defense
  try {
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      secure: request.url.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 20,
    });
  } catch (err) {
    console.warn("Could not set oauth state cookie:", err);
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "online");
  authUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(authUrl.toString());
}
