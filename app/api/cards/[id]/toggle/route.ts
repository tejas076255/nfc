import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { setCardActiveState } from "@/lib/cards/service";

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

    await setCardActiveState(id, session.workspace.id, Boolean(body.isActive), session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update card" }, { status: 400 });
  }
}
