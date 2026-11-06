import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminSetWorkspaceSlots, getAllWorkspacesForAdmin } from "@/lib/billing/service";

export async function GET() {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      ["super_admin", "ops_staff", "support_staff"].includes(session!.user.role);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const workspaces = await getAllWorkspacesForAdmin();
    return NextResponse.json({ workspaces });
  } catch (error: any) {
    console.error("Admin fetch workspaces error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch workspace slots" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      ["super_admin", "ops_staff", "support_staff"].includes(session!.user.role);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { workspaceId, extraSlots, planCode } = body as any;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required." }, { status: 400 });
    }

    const slotsNum = typeof extraSlots === "number" ? extraSlots : parseInt(extraSlots, 10) || 0;

    await adminSetWorkspaceSlots(workspaceId, Math.max(0, slotsNum), planCode);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin slot allocation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to allocate workspace slots" },
      { status: 500 }
    );
  }
}

