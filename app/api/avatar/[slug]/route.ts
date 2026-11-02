import { NextRequest } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rawSlug = (await params).slug || "";
    const slug = rawSlug.replace(/\.(jpg|jpeg|png|webp|svg)$/i, "").trim().toLowerCase();

    if (!slug) {
      return new Response("Profile slug required", { status: 400 });
    }

    const profile = await getPublishedProfileBySlug(slug);
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    const blocks = profile.blocks || [];
    const headerBlock = blocks.find((b: any) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
    const photoUrl =
      headerBlock.avatarUrl ||
      headerBlock.photoUrl ||
      headerBlock.coverUrl ||
      headerBlock.logoUrl ||
      null;

    if (!photoUrl) {
      const initial = (profile.name || "T").charAt(0).toUpperCase();
      const svg = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#2563eb" />
        <circle cx="150" cy="150" r="110" fill="rgba(255,255,255,0.18)" />
        <text x="150" y="185" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="110" font-weight="bold" fill="#ffffff" text-anchor="middle">${initial}</text>
      </svg>`;

      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    // Handle base64 data URLs
    if (photoUrl.startsWith("data:")) {
      const match = photoUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1] || "image/jpeg";
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");

        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    // Handle external URL
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return Response.redirect(photoUrl, 302);
    }

    return new Response("Invalid avatar format", { status: 400 });
  } catch (err: any) {
    return new Response(err.message || "Internal server error", { status: 500 });
  }
}

