import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { addLeadNote } from "@/lib/leads/service";

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
    const body = (await req.json()) as any;

    const note = await addLeadNote(id, session.workspace.id, session.user.id, body.content);
    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add note" }, { status: 400 });
  }
}
