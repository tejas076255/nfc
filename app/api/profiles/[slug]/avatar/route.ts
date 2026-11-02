import { NextRequest, NextResponse } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return new NextResponse("Profile slug required", { status: 400 });
    }

    const profile = await getPublishedProfileBySlug(slug);
    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
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
      // Return dynamic branded SVG with initials
      const initial = (profile.name || "T").charAt(0).toUpperCase();
      const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#2563eb" />
        <circle cx="200" cy="200" r="160" fill="rgba(255,255,255,0.15)" />
        <text x="200" y="235" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="140" font-weight="bold" fill="#ffffff" text-anchor="middle">${initial}</text>
      </svg>`;

      return new NextResponse(svg, {
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
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        return new NextResponse(bytes, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    // Handle standard HTTP/HTTPS URLs
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return NextResponse.redirect(photoUrl, 302);
    }

    return new NextResponse("Invalid avatar format", { status: 400 });
  } catch (err: any) {
    return new NextResponse(err.message || "Internal server error", { status: 500 });
  }
}

