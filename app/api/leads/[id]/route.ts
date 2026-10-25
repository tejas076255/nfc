import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getLeadDetails } from "@/lib/leads/service";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await getLeadDetails(id, session.workspace.id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
