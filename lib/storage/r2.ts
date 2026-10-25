const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadAsset(
  fileBuffer: ArrayBuffer | Uint8Array,
  mimeType: string,
  prefix = "profiles"
): Promise<{ url: string; key: string }> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WEBP, SVG.`);
  }

  if (fileBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds 5MB limit.");
  }

  const ext = mimeType.split("/")[1]?.replace("svg+xml", "svg") || "bin";
  const uniqueId = crypto.randomUUID();
  const key = `${prefix}/${uniqueId}.${ext}`;

  // Try Cloudflare R2 binding in worker runtime
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    if ((ctx?.env as any)?.BUCKET) {
      await ((ctx.env as any).BUCKET as any).put(key, fileBuffer, {
        httpMetadata: { contentType: mimeType },
      });
      return {
        key,
        url: `/api/assets/${key}`,
      };
    }
  } catch {
    // In local dev without R2 remote binding, store as base64 data-URL so preview works immediately!
  }

  // Fallback to data URL for local preview
  const uint8 = fileBuffer instanceof Uint8Array ? fileBuffer : new Uint8Array(fileBuffer);
  const base64 = Buffer.from(uint8).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return {
    key,
    url: dataUrl,
  };
}
