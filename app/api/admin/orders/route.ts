import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminCreateSampleOrder } from "@/lib/billing/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      (["ops_staff", "support_staff", "super_admin", "owner"].includes(session!.user.role) ||
        session?.membershipRole === "owner");

    if (!isStaff || !session?.workspace) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as any;
    const { variant = "matte_pvc", quantity = 1 } = body;

    const order = await adminCreateSampleOrder(session.workspace.id, variant, Math.max(1, quantity));

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Admin create sample order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create sample order" },
      { status: 500 }
    );
  }
}
