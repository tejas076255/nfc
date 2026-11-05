import { NextRequest, NextResponse } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
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
    const slug = rawSlug.trim().toLowerCase();

    if (!slug) {
      return NextResponse.json({ error: "Profile slug required" }, { status: 400 });
    }

    let profile = await getPublishedProfileBySlug(slug);
    if (!profile && slug === "htt") {
      profile = await getPublishedProfileBySlug("htt-5311");
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const blocks = profile.blocks || [];
    const headerBlock = blocks.find((b: any) => b.type === "identity_header")?.blockData || {};
    const aboutBlock = blocks.find((b: any) => b.type === "about")?.blockData || {};
    const themeConfig = profile.themeConfig || {};

    const origin = new URL(req.url).origin;
    const displayName = (profile.name || headerBlock.name || "Digital Card").trim();
    // App icon label on mobile home screen launcher: show user's clean name (e.g. "Chirag Chauhan")
    const shortName = displayName.length > 20 ? displayName.slice(0, 20) : displayName;
    const description = profile.bio || headerBlock.tagline || aboutBlock.bio || `Contactless NFC digital card for ${displayName}`;

    // Detect image mime type from header block
    const photoUrl =
      headerBlock.avatarUrl ||
      headerBlock.photoUrl ||
      headerBlock.coverUrl ||
      headerBlock.logoUrl ||
      aboutBlock.imageUrl ||
      "";

    let avatarMime = "image/png";
    if (photoUrl.startsWith("data:")) {
      const match = photoUrl.match(/^data:([^;]+);base64,/);
      if (match && match[1]) avatarMime = match[1];
    } else if (photoUrl.endsWith(".jpg") || photoUrl.endsWith(".jpeg")) {
      avatarMime = "image/jpeg";
    } else if (photoUrl.endsWith(".webp")) {
      avatarMime = "image/webp";
    }

    const avatarPngUrl = `${origin}/api/avatar/${slug}.png`;
    const avatarJpgUrl = `${origin}/api/avatar/${slug}.jpg`;

    const manifestData = {
      name: displayName,
      short_name: shortName,
      description: description,
      start_url: `/p/${slug}?source=pwa`,
      id: `/p/${slug}`,
      scope: `/p/${slug}`,
      display: "standalone",
      orientation: "portrait",
      background_color: themeConfig.backgroundColor || "#0f172a",
      theme_color: themeConfig.accentColor || "#2563eb",
      icons: [
        {
          src: avatarPngUrl,
          sizes: "192x192",
          type: avatarMime,
          purpose: "any",
        },
        {
          src: avatarPngUrl,
          sizes: "192x192",
          type: avatarMime,
          purpose: "maskable",
        },
        {
          src: avatarPngUrl,
          sizes: "512x512",
          type: avatarMime,
          purpose: "any",
        },
        {
          src: avatarPngUrl,
          sizes: "512x512",
          type: avatarMime,
          purpose: "maskable",
        },
        {
          src: avatarJpgUrl,
          sizes: "192x192",
          type: "image/jpeg",
          purpose: "any",
        },
        {
          src: avatarJpgUrl,
          sizes: "512x512",
          type: "image/jpeg",
          purpose: "any",
        },
        {
          src: `${origin}/icon-192x192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${origin}/icon-512x512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    };

    return new NextResponse(JSON.stringify(manifestData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate manifest" }, { status: 500 });
  }
}
