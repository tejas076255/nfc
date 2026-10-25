import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminUpdateOrderStatus } from "@/lib/billing/service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || !["ops_staff", "support_staff", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const { id: orderId } = await params;
    const body = (await req.json()) as any;
    const { status, trackingCarrier, trackingNumber, notes } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await adminUpdateOrderStatus(orderId, status, trackingCarrier, trackingNumber, notes);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin update order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
