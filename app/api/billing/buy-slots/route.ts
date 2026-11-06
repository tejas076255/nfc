import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { userPurchaseExtraSlots } from "@/lib/billing/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.workspace) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { quantity = 1 } = body as any;

    const count = Math.max(1, Math.min(10, parseInt(quantity, 10) || 1));

    const result = await userPurchaseExtraSlots(session.workspace.id, count);

    return NextResponse.json({
      success: true,
      message: `Successfully added ${count} extra card slot(s) to your workspace!`,
      newExtraSlots: result.newExtraSlots,
    });
  } catch (error: any) {
    console.error("Buy slots error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to purchase extra slots" },
      { status: 500 }
    );
  }
}
