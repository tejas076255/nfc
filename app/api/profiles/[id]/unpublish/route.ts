import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { unpublishProfile } from "@/lib/profiles/service";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await unpublishProfile(id, session.workspace.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to unpublish profile" }, { status: 400 });
  }
}
