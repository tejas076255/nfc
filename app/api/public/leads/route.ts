import { NextResponse } from "next/server";
import { createPublicLead } from "@/lib/leads/service";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const result = await createPublicLead({
      profileId: body.profileId,
      visitorName: body.visitorName,
      phone: body.phone,
      email: body.email,
      message: body.message,
      serviceInterest: body.serviceInterest,
      sourceType: body.sourceType,
      sourceToken: body.sourceToken,
      contactConsent: Boolean(body.contactConsent),
      marketingConsent: Boolean(body.marketingConsent),
      submissionKey: body.submissionKey,
    });

    return NextResponse.json({ success: true, submissionId: result.id, duplicate: result.duplicate }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process lead submission" }, { status: 400 });
  }
}
