import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminToggleProfileStatus } from "@/lib/profiles/service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      (["ops_staff", "support_staff", "super_admin", "owner"].includes(session!.user.role) ||
        session?.membershipRole === "owner");

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const { id } = await params;
    const result = await adminToggleProfileStatus(id);

    return NextResponse.json({
      success: true,
      profile: result,
    });
  } catch (error: any) {
    console.error("Admin toggle profile status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle profile status" },
      { status: 500 }
    );
  }
}

