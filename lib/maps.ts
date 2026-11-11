export const GOOGLE_MAPS_EMBED_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  "AIzaSyDZg3vv-y5GZpfxUHtLABmy6jAgPUkTccs";

/**
 * Extracts or generates a valid Google Maps Embed iframe URL.
 * 1. If user provided a custom iframe embed code, extracts src.
 * 2. If user provided an embed URL (google.com/maps/embed/...), returns it directly.
 * 3. If user provided an address or query, uses Google Maps Embed API to generate a high-definition interactive map.
 */
export function extractMapEmbedSrc(embedInput?: string, fallbackAddress?: string): string | null {
  if (embedInput && typeof embedInput === "string") {
    const trimmed = embedInput.trim();
    if (trimmed.includes("<iframe")) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) return match[1];
    }
    if (trimmed.includes("google.com/maps/embed")) {
      return trimmed;
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      try {
        const u = new URL(trimmed);
        const q = u.searchParams.get("q") || u.searchParams.get("query") || u.searchParams.get("destination");
        if (q) {
          return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_KEY}&q=${encodeURIComponent(q)}`;
        }
      } catch {}
      return trimmed;
    }
  }

  // Auto-generate high-definition Google Map from user physical street address or city
  const rawQuery = (
    fallbackAddress ||
    (embedInput && !embedInput.startsWith("<") && !embedInput.startsWith("http") ? embedInput : "") ||
    ""
  ).trim();

  if (rawQuery) {
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_KEY}&q=${encodeURIComponent(rawQuery)}`;
  }

  return null;
}

/**
 * Generates direct Google Maps app directions URL for turn-by-turn navigation.
 */
export function getGoogleMapsDirectionsUrl(addressOrQuery?: string, customMapUrl?: string): string | null {
  if (customMapUrl && customMapUrl.trim().startsWith("http")) {
    return customMapUrl.trim();
  }
  const query = (addressOrQuery || "").trim();
  if (!query) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

