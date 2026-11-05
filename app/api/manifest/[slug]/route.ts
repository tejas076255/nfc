import { NextRequest, NextResponse } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";

export const dynamic = "force-dynamic";

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

    const profile = await getPublishedProfileBySlug(slug);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const blocks = profile.blocks || [];
    const headerBlock = blocks.find((b: any) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
    const themeConfig = profile.themeConfig || {};

    const origin = new URL(req.url).origin;
    const displayName = profile.name || "Digital Card";
    const shortName = displayName.length > 15 ? displayName.slice(0, 15) : displayName;
    const description = profile.bio || headerBlock.tagline || `Contactless NFC digital card for ${displayName}`;
    const avatarIconUrl = `${origin}/api/avatar/${slug}.png`;

        const manifestData = {
      name: `tapbez - ${displayName}`,
      short_name: "tapbez",
      description: description,
      start_url: `/p/${slug}?source=pwa`,
      id: `/p/${slug}`,
      scope: `/`,
      display: "standalone",
      orientation: "portrait",
      background_color: themeConfig.backgroundColor || "#ffffff",
      theme_color: themeConfig.accentColor || "#0d9488",
      icons: [
        {
          src: `${origin}/icon-192x192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${origin}/icon-maskable-192x192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: `${origin}/icon-512x512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${origin}/icon-maskable-512x512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    };

    return new NextResponse(JSON.stringify(manifestData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate manifest" }, { status: 500 });
  }
}

