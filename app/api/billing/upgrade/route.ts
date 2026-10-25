import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { upgradeSubscriptionPlan } from "@/lib/billing/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.workspace) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as any;
    const { planCode } = body;

    if (!planCode || !["free", "starter", "professional", "business_pro"].includes(planCode)) {
      return NextResponse.json({ error: "Invalid plan code" }, { status: 400 });
    }

    const result = await upgradeSubscriptionPlan(session.workspace.id, planCode);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
