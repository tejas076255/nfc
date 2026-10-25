import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { createPhysicalCardOrder } from "@/lib/billing/service";

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as any;
    const result = await createPhysicalCardOrder({
      workspaceId: session.workspace.id,
      variant: body.variant,
      quantity: Number(body.quantity) || 1,
      printDesignData: body.printDesignData,
      shippingAddress: body.shippingAddress,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 400 });
  }
}
