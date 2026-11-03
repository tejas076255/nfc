import { NextRequest, NextResponse } from "next/server";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";
import { generateVCardString } from "@/lib/profiles/vcard";
import { getDb, schema } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { logAnalyticsEvent } from "@/lib/analytics/service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Profile ID or slug required", { status: 400 });
    }

    const db = await getDb();
    const [p] = await db
      .select({
        id: schema.profiles.id,
        slug: schema.profiles.slug,
        workspaceId: schema.profiles.workspaceId,
      })
      .from(schema.profiles)
      .where(or(eq(schema.profiles.id, id), eq(schema.profiles.slug, id)))
      .limit(1);

    if (!p) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const profile = await getPublishedProfileBySlug(p.slug);
    if (!profile) {
      return new NextResponse("Profile not published yet", { status: 404 });
    }

    // Non-blocking analytics logging for vCard download
    logAnalyticsEvent({
      workspaceId: p.workspaceId,
      profileId: p.id,
      eventType: "save_contact_click",
      sourceType: "vcard_download",
    }).catch(() => {});

    const blocks = profile.blocks || [];
    const headerBlock = blocks.find((b: any) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
    const contactBlock = blocks.find((b: any) => b.type === "contact_actions" && b.isEnabled)?.blockData || {};
    const locationBlock = blocks.find((b: any) => b.type === "location_hours" && b.isEnabled)?.blockData || {};
    const aboutBlock = blocks.find((b: any) => b.type === "about" && b.isEnabled)?.blockData || {};

    const personName = headerBlock.displayName || profile.name || "Business Contact";
    const professionalTitle = headerBlock.title || profile.title || "";
    const companyName = headerBlock.companyName || "";

    const vCardData = generateVCardString({
      name: personName,
      title: professionalTitle,
      company: companyName,
      phone: contactBlock.phone,
      email: contactBlock.email,
      whatsapp: contactBlock.whatsapp,
      websiteUrl: contactBlock.websiteUrl,
      address: locationBlock.address || contactBlock.location,
      bio: aboutBlock.bio || profile.bio,
    });

    const cleanFilename = personName.replace(/[^a-zA-Z0-9_\-]/g, "_") || "contact";

    return new NextResponse(vCardData, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${cleanFilename}.vcf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message || "Failed to generate vCard", { status: 500 });
  }
}
