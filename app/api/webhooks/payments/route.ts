import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

async function verifyRazorpaySignature(
  bodyText: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
    const expectedSignature = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedSignature.toLowerCase() === signature.toLowerCase();
  } catch (e) {
    console.error("Signature verification error:", e);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "simulated_secret";

    // In production with configured webhook secret, verify HMAC signature
    if (process.env.NODE_ENV === "production" && webhookSecret !== "simulated_secret") {
      if (!signature) {
        return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
      }

      const isValid = await verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const db = await getDb();
    const now = Math.floor(Date.now() / 1000);

    // Handle payment.captured or order.paid
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const [existingOrder] = await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.razorpayOrderId, razorpayOrderId))
          .limit(1);

        if (existingOrder && existingOrder.status !== "paid") {
          // Idempotent state transition to 'paid'
          await db
            .update(schema.orders)
            .set({
              status: "paid",
              razorpayPaymentId: razorpayPaymentId || existingOrder.razorpayPaymentId,
              updatedAt: now,
            })
            .where(eq(schema.orders.id, existingOrder.id));

          // Ensure corresponding invoice is marked paid
          await db
            .update(schema.invoices)
            .set({ status: "paid" })
            .where(eq(schema.invoices.orderId, existingOrder.id));
        }
      }
    }

    // Record audit event for webhook
    await db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      actorId: "system_webhook",
      actorRole: "system",
      action: "webhook.received",
      resourceType: "payment",
      metadata: JSON.stringify({
        event: event.event,
        id: event.payload?.payment?.entity?.id || event.payload?.order?.entity?.id,
      }),
      createdAt: now,
    });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Payment webhook handler error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
