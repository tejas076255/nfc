import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminRecordQA } from "@/lib/cards/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !["ops_staff", "support_staff", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = (await req.json()) as any;
    const { cardId, step, result, readbackUrl, verifiedQrToken, notes } = body;

    if (!cardId || !step || !result) {
      return NextResponse.json({ error: "Missing required QA fields" }, { status: 400 });
    }

    await adminRecordQA({
      cardId,
      operatorId: session.user.id,
      step,
      result,
      readbackUrl,
      verifiedQrToken,
      notes,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin QA record error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record QA inspection" },
      { status: 500 }
    );
  }
}
