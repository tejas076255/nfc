import crypto from "crypto";

export function getCanonicalGoogleRedirectUri(requestUrl: string, hostHeader?: string | null): string {
  const isLocal = (hostHeader && hostHeader.includes("localhost")) || requestUrl.includes("localhost");
  if (isLocal) {
    const proto = hostHeader?.includes("localhost") ? "http" : "https";
    return `${proto}://${hostHeader || "localhost:3000"}/api/auth/callback/google`;
  }
  // Standard production canonical redirect URI configured in Google Cloud Console
  return "https://tapbez.in/api/auth/callback/google";
}

export function createSignedOAuthState(returnTo: string = "/dashboard"): string {
  const secret = process.env.JWT_SECRET || "nfc-saas-production-jwt-secret-key-32charsmin";
  const payload = JSON.stringify({
    nonce: crypto.randomUUID(),
    t: Date.now(),
    returnTo: returnTo.startsWith("/") ? returnTo : "/dashboard",
  });
  const b64Payload = Buffer.from(payload, "utf-8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(b64Payload).digest("base64url");
  return `${b64Payload}.${signature}`;
}

export function verifySignedOAuthState(stateStr?: string | null): { valid: boolean; returnTo: string } {
  if (!stateStr || typeof stateStr !== "string") {
    return { valid: false, returnTo: "/dashboard" };
  }
  try {
    const secret = process.env.JWT_SECRET || "nfc-saas-production-jwt-secret-key-32charsmin";
    const parts = stateStr.split(".");
    if (parts.length !== 2) {
      return { valid: false, returnTo: "/dashboard" };
    }
    const [b64Payload, signature] = parts;
    if (!b64Payload || !signature) {
      return { valid: false, returnTo: "/dashboard" };
    }
    const expectedSignature = crypto.createHmac("sha256", secret).update(b64Payload).digest("base64url");
    if (signature !== expectedSignature) {
      return { valid: false, returnTo: "/dashboard" };
    }
    const raw = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    const age = Date.now() - (parsed.t || 0);
    // Allow up to 20 minutes for user to complete OAuth consent
    if (age < -10000 || age > 20 * 60 * 1000) {
      return { valid: false, returnTo: "/dashboard" };
    }
    return { valid: true, returnTo: parsed.returnTo || "/dashboard" };
  } catch {
    return { valid: false, returnTo: "/dashboard" };
  }
}

