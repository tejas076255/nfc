import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { updateProfileDraft, getProfileById, deleteProfile } from "@/lib/profiles/service";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const profile = await getProfileById(id, session.workspace.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

async function handleUpdate(req: Request, params: Promise<{ id: string }>) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as any;

    await updateProfileDraft(id, session.workspace.id, body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update draft" }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: RouteProps) {
  return handleUpdate(req, params);
}

export async function PATCH(req: Request, { params }: RouteProps) {
  return handleUpdate(req, params);
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await deleteProfile(id, session.workspace.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete profile" }, { status: 400 });
  }
}
