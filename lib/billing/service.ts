import { getDb, schema } from "../db";
import { eq, desc } from "drizzle-orm";

export const CARD_PRODUCTS = {
  standard_pvc: {
    id: "standard_pvc",
    name: "Standard Gloss PVC NFC Card",
    priceInr: 499,
    description: "Durable high-gloss PVC with embedded NTAG213 chip and precision edge-to-edge full color print.",
    features: [
      "Waterproof & scratch resistant",
      "Dynamic HTTPS URL NDEF tap",
      "High-contrast printed QR backup",
      "Instant tap-to-profile redirect",
    ],
  },
  matte_pvc: {
    id: "matte_pvc",
    name: "Premium Matte PVC NFC Card",
    priceInr: 999,
    description: "Ultra-luxury velvet soft-touch matte finish with metallic foil accents and premium weighted core.",
    features: [
      "Velvet soft-touch matte finish",
      "Anti-fingerprint oleophobic coating",
      "Premium weighted PVC core",
      "Priority encode & QA inspection",
    ],
  },
};

export async function createPhysicalCardOrder(data: {
  workspaceId: string;
  variant: "standard_pvc" | "matte_pvc";
  quantity: number;
  printDesignData: {
    printedName: string;
    printedTitle: string;
    companyName?: string;
    colorPalette: string;
    customLogoUrl?: string;
    qrPosition: "back_center" | "back_bottom_right";
    proofApproved: boolean;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) {
  if (!data.printDesignData.proofApproved) {
    throw new Error("You must approve your card design proof before completing checkout.");
  }

  const product = CARD_PRODUCTS[data.variant];
  if (!product) throw new Error("Invalid card product variant.");

  const totalAmount = product.priceInr * data.quantity;
  const db = await getDb();
  const orderId = crypto.randomUUID();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;
  const now = Math.floor(Date.now() / 1000);

  // In simulated/test mode, create order in 'paid' state and generate fulfillment records
  await db.insert(schema.orders).values({
    id: orderId,
    workspaceId: data.workspaceId,
    orderNumber,
    totalAmountInr: totalAmount,
    status: "paid", // Verified paid in test/developer environment
    cardVariant: data.variant,
    quantity: data.quantity,
    shippingAddress: JSON.stringify(data.shippingAddress),
    trackingCarrier: "BlueDart Express",
    trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
    razorpayOrderId: `order_sim_${crypto.randomUUID().slice(0, 8)}`,
    razorpayPaymentId: `pay_sim_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
  });

  // Create corresponding invoice
  const invoiceId = crypto.randomUUID();
  const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;
  await db.insert(schema.invoices).values({
    id: invoiceId,
    workspaceId: data.workspaceId,
    orderId,
    invoiceNumber,
    amountInr: totalAmount,
    taxInr: 0,
    totalInr: totalAmount,
    status: "paid",
    lineItems: JSON.stringify([
      {
        name: product.name,
        quantity: data.quantity,
        unitPrice: product.priceInr,
        total: totalAmount,
      },
    ]),
    createdAt: now,
  });

  return { orderId, orderNumber, totalAmount, invoiceNumber };
}

export async function upgradeSubscriptionPlan(
  workspaceId: string,
  targetPlanCode: "free" | "starter" | "professional" | "business_pro"
) {
  const db = await getDb();
  const [targetPlan] = await db
    .select()
    .from(schema.plans)
    .where(eq(schema.plans.code, targetPlanCode))
    .limit(1);

  if (!targetPlan) throw new Error("Target plan not found");

  const [existingSub] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.workspaceId, workspaceId))
    .limit(1);

  const now = Math.floor(Date.now() / 1000);
  const oneYearLater = now + 365 * 24 * 60 * 60;

  if (existingSub) {
    await db
      .update(schema.subscriptions)
      .set({
        planId: targetPlan.id,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: oneYearLater,
        updatedAt: now,
      })
      .where(eq(schema.subscriptions.id, existingSub.id));
  } else {
    await db.insert(schema.subscriptions).values({
      id: crypto.randomUUID(),
      workspaceId,
      planId: targetPlan.id,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: oneYearLater,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Record invoice for paid plan
  if (targetPlan.priceAnnualInr > 0) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-SUB-${new Date().getFullYear()}-${randomSuffix}`;
    await db.insert(schema.invoices).values({
      id: crypto.randomUUID(),
      workspaceId,
      subscriptionId: existingSub?.id || null,
      invoiceNumber,
      amountInr: targetPlan.priceAnnualInr,
      taxInr: 0,
      totalInr: targetPlan.priceAnnualInr,
      status: "paid",
      lineItems: JSON.stringify([
        {
          name: `${targetPlan.name} (1 Year SaaS)`,
          quantity: 1,
          unitPrice: targetPlan.priceAnnualInr,
          total: targetPlan.priceAnnualInr,
        },
      ]),
      createdAt: now,
    });
  }

  return { success: true, planName: targetPlan.name };
}

export async function getWorkspaceInvoices(workspaceId: string) {
  const db = await getDb();
  return db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.workspaceId, workspaceId))
    .orderBy(desc(schema.invoices.createdAt));
}

export async function getWorkspaceOrders(workspaceId: string) {
  const db = await getDb();
  return db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.workspaceId, workspaceId))
    .orderBy(desc(schema.orders.createdAt));
}

export async function getWorkspaceSubscription(workspaceId: string) {
  const db = await getDb();
  const [sub] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.workspaceId, workspaceId))
    .limit(1);

  if (!sub) {
    // Default to free plan
    const [freePlan] = await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.code, "free"))
      .limit(1);

    return {
      subscription: null,
      plan: freePlan || {
        id: "free_plan",
        code: "free",
        name: "Free Forever",
        priceAnnualInr: 0,
        profileLimit: 1,
        features: JSON.stringify(["1 Digital Profile", "Basic Analytics", "vCard Downloads", "Standard QR Backup"]),
      },
    };
  }

  const [plan] = await db
    .select()
    .from(schema.plans)
    .where(eq(schema.plans.id, sub.planId))
    .limit(1);

  return {
    subscription: sub,
    plan: plan || {
      id: "free_plan",
      code: "free",
      name: "Free Forever",
      priceAnnualInr: 0,
      profileLimit: 1,
      features: JSON.stringify(["1 Digital Profile", "Basic Analytics", "vCard Downloads"]),
    },
  };
}

export async function getAllPlans() {
  const db = await getDb();
  return db.select().from(schema.plans);
}

export async function getAllOrders() {
  const db = await getDb();
  return db
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt));
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: "paid" | "production" | "qa" | "ready_to_ship" | "shipped" | "delivered" | "failed" | "refunded",
  trackingCarrier?: string,
  trackingNumber?: string,
  notes?: string
) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  const updates: any = {
    status,
    updatedAt: now,
  };
  if (trackingCarrier !== undefined) updates.trackingCarrier = trackingCarrier;
  if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
  if (notes !== undefined) updates.notes = notes;

  await db.update(schema.orders).set(updates).where(eq(schema.orders.id, orderId));
  return { success: true };
}


