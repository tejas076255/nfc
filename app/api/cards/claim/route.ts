import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { claimCard } from "@/lib/cards/service";

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session || !session.workspace) {
    return NextResponse.json({ error: "Authentication required to claim an NFC card." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as any;
    const result = await claimCard(
      session.workspace.id,
      session.user.id,
      body.claimSecret,
      body.profileId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to claim card" }, { status: 400 });
  }
}
