import { NextResponse } from "next/server";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    const ip = headerList.get("x-forwarded-for") || headerList.get("cf-connecting-ip") || "";

    await logAnalyticsEvent({
      workspaceId: body.workspaceId || body.profileId,
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
