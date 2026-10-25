import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createTrackableQrCode, getWorkspaceQrCodes } from "@/lib/qr/service";

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const qrCodes = await getWorkspaceQrCodes(session.workspace.id);
  return NextResponse.json({ qrCodes });
}

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as any;
    const result = await createTrackableQrCode({
      workspaceId: session.workspace.id,
      profileId: body.profileId,
      title: body.title,
      campaign: body.campaign,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create QR code" }, { status: 400 });
  }
}
