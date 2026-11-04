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
      return new NextResponse("Profile slug required", { status: 400 });
    }

    const profile = await getPublishedProfileBySlug(slug);
    const targetSlug = profile?.slug || (slug === "htt" ? "htt-5311" : slug);
    const origin = new URL(req.url).origin;
    const profileUrl = `${origin}/p/${targetSlug}`;
    const cleanName = (profile?.name || "Digital-Card")
      .replace(/[/\\?%*:|"<>]/g, "")
      .trim() || "Digital-Profile";

    // Windows Internet Shortcut format (.url) with icon
    const shortcutContent = `[InternetShortcut]\r\nURL=${profileUrl}\r\nIconFile=${origin}/api/avatar/${targetSlug}.png\r\nIconIndex=0\r\n`;

    return new NextResponse(shortcutContent, {
      status: 200,
      headers: {
        "Content-Type": "application/internet-shortcut; charset=utf-8",
        "Content-Disposition": `attachment; filename="${cleanName}.url"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (_err: any) {
    return new NextResponse("Failed to generate shortcut", { status: 500 });
  }
}
