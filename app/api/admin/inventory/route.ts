import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { adminGenerateInventory } from "@/lib/cards/service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const isStaff =
      Boolean(session?.user) &&
      ["super_admin", "ops_staff", "support_staff"].includes(session!.user.role);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = (await req.json()) as any;
    const { quantity = 10, variant = "standard_pvc" } = body;

    const qty = Math.min(Math.max(1, parseInt(quantity, 10) || 1), 100);
    const validVariants = ["standard_pvc", "custom_pvc", "custom_metal", "matte_pvc"] as const;
    const validVariant = (validVariants as readonly string[]).includes(variant)
      ? (variant as (typeof validVariants)[number])
      : "standard_pvc";

    const batch = await adminGenerateInventory(qty, validVariant, session!.user.id);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tapbez.in";
    const formatted = batch.map((c) => ({
      ...c,
      ndefUrl: `${baseUrl}/t/${c.publicToken}`,
      variant: validVariant,
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      cards: formatted,
    });
  } catch (error: any) {
    console.error("Admin inventory generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate card batch" },
      { status: 500 }
    );
  }
}
