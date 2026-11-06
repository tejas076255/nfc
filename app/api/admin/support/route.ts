import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getAllSupportTickets, adminUpdateSupportTicketStatus } from "@/lib/billing/service";

export async function GET() {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      ["super_admin", "ops_staff", "support_staff"].includes(session!.user.role);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const tickets = await getAllSupportTickets();
    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("Admin fetch support tickets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      ["super_admin", "ops_staff", "support_staff"].includes(session!.user.role);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { ticketId, status } = body as any;

    if (!ticketId || !status) {
      return NextResponse.json({ error: "ticketId and status are required." }, { status: 400 });
    }

    await adminUpdateSupportTicketStatus(ticketId, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin update support ticket error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update support ticket" },
      { status: 500 }
    );
  }
}
