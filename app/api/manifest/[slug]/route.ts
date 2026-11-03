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
    const avatarIconUrl = `${origin}/api/avatar/${slug}.jpg`;

    const manifestData = {
      name: `${displayName} | TapSync NFC`,
      short_name: shortName,
      description: description,
      start_url: `/p/${slug}`,
      id: `/p/${slug}`,
      scope: `/p/${slug}`,
      display: "standalone",
      orientation: "portrait",
      background_color: themeConfig.backgroundColor || "#0a0e17",
      theme_color: themeConfig.accentColor || "#2563eb",
      icons: [
        {
          src: avatarIconUrl,
          sizes: "192x192",
          type: "image/jpeg",
          purpose: "any maskable",
        },
        {
          src: avatarIconUrl,
          sizes: "512x512",
          type: "image/jpeg",
          purpose: "any maskable",
        },
      ],
    };

    return new NextResponse(JSON.stringify(manifestData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate manifest" }, { status: 500 });
  }
}

