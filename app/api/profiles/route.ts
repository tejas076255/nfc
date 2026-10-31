import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createProfile, getWorkspaceProfiles } from "@/lib/profiles/service";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await getWorkspaceProfiles(session.workspace.id);
  return NextResponse.json({ profiles });
}

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as any;
    const result = await createProfile(session.workspace.id, {
      name: body.name,
      industry: body.industry,
      slug: body.slug,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    const isPlanLimit = error.message?.includes("PLAN_LIMIT_REACHED");
    return NextResponse.json(
      {
        error: error.message || "Failed to create profile",
        code: isPlanLimit ? "PLAN_LIMIT_REACHED" : "CREATE_FAILED",
      },
      { status: isPlanLimit ? 403 : 400 }
    );
  }
}
