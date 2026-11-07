import { NextRequest } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rawSlug = (await params).slug || "";
    const isPngRequest = /\.png$/i.test(rawSlug) || req.nextUrl.pathname.endsWith(".png");
    const slug = rawSlug.replace(/\.(jpg|jpeg|png|webp|svg|ico)$/i, "").trim().toLowerCase();

    if (!slug) {
      return new Response("Profile slug required", { status: 400 });
    }

    let profile = await getPublishedProfileBySlug(slug);
    if (!profile && slug === "htt") {
      profile = await getPublishedProfileBySlug("htt-5311");
    }

    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    const blocks = profile.blocks || [];
    const headerBlock = blocks.find((b: any) => b.type === "identity_header")?.blockData || {};
    const aboutBlock = blocks.find((b: any) => b.type === "about")?.blockData || {};
    const photoUrl =
      headerBlock.avatarUrl ||
      headerBlock.photoUrl ||
      headerBlock.coverUrl ||
      headerBlock.logoUrl ||
      aboutBlock.imageUrl ||
      null;

    const origin = new URL(req.url).origin;

    if (!photoUrl) {
      try {
        const fallbackRes = await fetch(`${origin}/icon-512x512.png`);
        if (fallbackRes.ok) {
          const buf = await fallbackRes.arrayBuffer();
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Content-Length": buf.byteLength.toString(),
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch { }
      return Response.redirect(`${origin}/icon-512x512.png`, 302);
    }

    // Handle base64 data URLs
    if (photoUrl.startsWith("data:")) {
      const match = photoUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = isPngRequest ? "image/png" : (match[1] || "image/jpeg");
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");

        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Length": buffer.length.toString(),
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    // Handle external URL - proxy bytes directly without 302 redirect for WhatsApp and PWA crawlers
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      try {
        const extRes = await fetch(photoUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (extRes.ok) {
          const contentType = extRes.headers.get("content-type") || "image/jpeg";
          const buf = await extRes.arrayBuffer();
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Content-Length": buf.byteLength.toString(),
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch { }
      return Response.redirect(photoUrl, 302);
    }

    return new Response("Invalid avatar format", { status: 400 });
  } catch (err: any) {
    return new Response(err.message || "Internal server error", { status: 500 });
  }
}
