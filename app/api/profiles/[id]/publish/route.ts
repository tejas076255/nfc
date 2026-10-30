import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { publishProfile } from "@/lib/profiles/service";

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
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const result = await publishProfile(id, session.workspace.id, session.user.id, {
      unpublishOthers: Boolean(body?.unpublishOthers),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to publish profile" }, { status: 400 });
  }
}
