import { NextResponse } from "next/server";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    const ip = headerList.get("x-forwarded-for") || headerList.get("cf-connecting-ip") || "";

    const db = await getDb();
    let effectiveWorkspaceId = body.workspaceId;

    // If workspaceId was not provided, look it up from the profile
    if (!effectiveWorkspaceId && body.profileId) {
      const [p] = await db
        .select({ workspaceId: schema.profiles.workspaceId })
        .from(schema.profiles)
        .where(eq(schema.profiles.id, body.profileId))
        .limit(1);

      if (p?.workspaceId) {
        effectiveWorkspaceId = p.workspaceId;
      }
    }

    if (!effectiveWorkspaceId) {
      return NextResponse.json({ error: "Missing workspaceId and profileId" }, { status: 400 });
    }

    await logAnalyticsEvent({
      workspaceId: effectiveWorkspaceId,
      profileId: body.profileId,
      eventType: body.eventType,
      sourceToken: body.sourceToken,
      sourceType: body.sourceType,
      userAgent,
      ipHash: ip.slice(0, 8),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
