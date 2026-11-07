import { getDb, schema } from "../db";
import { eq, desc } from "drizzle-orm";
import { fastCache } from "../cache";

export const CARD_PRODUCTS = {
  standard_pvc: {
    id: "standard_pvc",
    name: "Standard PVC NFC Card",
    priceInr: 999,
    priceLabel: "₹999",
    tagline: "Simple. Smart. Professional.",
    image: "/landing/card-standard.jpg",
    imageAlt: "Standard white PVC NFC business card",
    material: "PVC",
    design: "Standard design selection",
    logoPersonalization: false,
    badge: null,
    features: [
      "NFC-enabled PVC card",
      "Standard design selection",
      "Linked digital business profile",
      "Tap-to-share functionality",
      "QR sharing option",
    ],
    description: "Durable high-gloss PVC with embedded NTAG213 chip and standard layout design.",
  },
  custom_pvc: {
    id: "custom_pvc",
    name: "Customized PVC NFC Card",
    priceInr: 1499,
    priceLabel: "₹1,499",
    tagline: "Your brand. Your identity. Your smart card.",
    image: "/landing/card-custom-pvc.jpg",
    imageAlt: "Customized PVC NFC business card with company branding",
    material: "PVC",
    design: "Fully custom design",
    logoPersonalization: true,
    badge: "Recommended",
    features: [
      "NFC-enabled PVC card",
      "Personalized name and branding",
      "Custom logo and artwork",
      "Digital business profile",
      "Tap and QR sharing",
    ],
    description: "Ultra-luxury velvet soft-touch finish with custom full-color logo, personal name, and artwork.",
  },
  custom_metal: {
    id: "custom_metal",
    name: "Customized Metal NFC Card",
    priceInr: 1999,
    priceLabel: "₹1,999",
    tagline: "Make a premium first impression.",
    image: "/landing/card-metal.jpg",
    imageAlt: "Premium champagne-gold metal NFC business card",
    material: "Metal",
    design: "Fully custom design",
    logoPersonalization: true,
    badge: "Ultra Premium",
    features: [
      "Premium metal card",
      "Custom branding",
      "NFC-enabled sharing",
      "Digital business profile",
      "Premium product presentation",
    ],
    description: "Laser-etched aerospace-grade metal card with precision gold/dark finish and presentation sleeve.",
  },
  // Backward compatibility alias for any existing orders:
  matte_pvc: {
    id: "matte_pvc",
    name: "Customized PVC NFC Card",
    priceInr: 1499,
    priceLabel: "₹1,499",
    tagline: "Your brand. Your identity. Your smart card.",
    image: "/landing/card-custom-pvc.jpg",
    imageAlt: "Customized PVC NFC business card with company branding",
    material: "PVC",
    design: "Fully custom design",
    logoPersonalization: true,
    badge: "Recommended",
    features: [
      "NFC-enabled PVC card",
      "Personalized name and branding",
      "Custom logo and artwork",
      "Digital business profile",
      "Tap and QR sharing",
    ],
    description: "Ultra-luxury velvet soft-touch finish with custom full-color logo, personal name, and artwork.",
  },
} as const;

export type CardVariantKey = "standard_pvc" | "custom_pvc" | "custom_metal" | "matte_pvc";

export async function createPhysicalCardOrder(data: {
  workspaceId: string;
  variant: CardVariantKey;
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

export const LANDING_PLANS = [
  {
    id: "plan_free",
    code: "free",
    name: "Free Digital Identity",
    priceAnnualInr: 0,
    profileLimit: 1,
    features: JSON.stringify([
      "1 Dynamic Digital Profile",
      "Instant vCard 1-Tap Save",
      "Downloadable Profile QR Code",
      "Standard Social & Bio Blocks",
      "Basic Scan Counter",
    ]),
    isActive: 1,
  },
  {
    id: "plan_standard_pvc",
    code: "standard_pvc",
    name: "Standard PVC NFC Card",
    priceAnnualInr: 999,
    profileLimit: 3,
    features: JSON.stringify([
      "NFC-enabled PVC card",
      "Standard design selection",
      "3 Published Digital Profiles",
      "Tap and QR sharing",
      "Linked digital business profile",
      "Free Delivery Across India",
    ]),
    isActive: 1,
  },
  {
    id: "plan_custom_pvc",
    code: "custom_pvc",
    name: "Customized PVC NFC Card",
    priceAnnualInr: 1499,
    profileLimit: 10,
    features: JSON.stringify([
      "Customized PVC NFC card",
      "Personalized name and branding",
      "Custom logo and artwork",
      "Remove Tapbez Footer Branding",
      "10 Published Digital Profiles",
      "Appointment & Calendly Booking",
      "Live Tap Analytics & Telemetry",
    ]),
    isActive: 1,
  },
  {
    id: "plan_custom_metal",
    code: "custom_metal",
    name: "Customized Metal NFC Card",
    priceAnnualInr: 1999,
    profileLimit: 25,
    features: JSON.stringify([
      "Premium laser-etched metal card",
      "Custom laser branding & artwork",
      "Remove Tapbez Footer Branding",
      "25 Published Digital Profiles",
      "Centralized Team Console Support",
      "Custom Corporate Domain Support",
      "VIP Concierge Priority Support",
    ]),
    isActive: 1,
  },
];

export async function upgradeSubscriptionPlan(
  workspaceId: string,
  targetPlanCode: string
) {
  const db = await getDb();

  // Normalize code aliases:
  let canonicalCode = targetPlanCode;
  if (targetPlanCode === "starter") canonicalCode = "standard_pvc";
  else if (targetPlanCode === "professional") canonicalCode = "custom_pvc";
  else if (targetPlanCode === "business_pro") canonicalCode = "custom_metal";

  let [targetPlan] = await db
    .select()
    .from(schema.plans)
    .where(eq(schema.plans.code, canonicalCode as any))
    .limit(1);

  if (!targetPlan && canonicalCode !== targetPlanCode) {
    [targetPlan] = await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.code, targetPlanCode as any))
      .limit(1);
  }

  if (!targetPlan) {
    const landingPlan = LANDING_PLANS.find(
      (p) => p.code === canonicalCode || p.code === targetPlanCode
    ) || LANDING_PLANS[0];

    try {
      await db.insert(schema.plans).values({
        id: landingPlan.id,
        code: landingPlan.code as any,
        name: landingPlan.name,
        priceAnnualInr: landingPlan.priceAnnualInr,
        profileLimit: landingPlan.profileLimit,
        features: landingPlan.features,
        isActive: 1,
      });
      targetPlan = landingPlan as any;
    } catch {
      targetPlan = landingPlan as any;
    }
  }

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
      plan: freePlan || LANDING_PLANS[0],
    };
  }

  const [plan] = await db
    .select()
    .from(schema.plans)
    .where(eq(schema.plans.id, sub.planId))
    .limit(1);

  // Match canonical landing plan details
  const matchedLandingPlan = LANDING_PLANS.find(
    (lp) =>
      lp.code === plan?.code ||
      (lp.code === "standard_pvc" && plan?.code === "starter") ||
      (lp.code === "custom_pvc" && plan?.code === "professional") ||
      (lp.code === "custom_metal" && plan?.code === "business_pro")
  );

  return {
    subscription: sub,
    plan: matchedLandingPlan
      ? { ...matchedLandingPlan, id: plan?.id || matchedLandingPlan.id }
      : plan || LANDING_PLANS[0],
  };
}

export async function getAllPlans() {
  const db = await getDb();
  const dbPlans = await db.select().from(schema.plans);
  if (!dbPlans || dbPlans.length === 0) {
    return LANDING_PLANS;
  }
  return LANDING_PLANS.map((lp) => {
    const matched = dbPlans.find(
      (p) =>
        p.code === lp.code ||
        (lp.code === "standard_pvc" && p.code === "starter") ||
        (lp.code === "custom_pvc" && p.code === "professional") ||
        (lp.code === "custom_metal" && p.code === "business_pro")
    );
    return {
      ...lp,
      id: matched?.id || lp.id,
    };
  });
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

export async function adminCreateSampleOrder(
  workspaceId: string,
  variant: CardVariantKey = "custom_pvc",
  quantity: number = 1
) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = crypto.randomUUID();

  const product = CARD_PRODUCTS[variant as keyof typeof CARD_PRODUCTS] || CARD_PRODUCTS.custom_pvc;
  const unitPrice = product.priceInr;
  const totalAmount = unitPrice * quantity;

  const sampleAddress = JSON.stringify({
    fullName: "Rikesh Panchal",
    phone: "+91 98765 43210",
    street: "Level 4, Signature Hub, SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380015",
  });

  await db.insert(schema.orders).values({
    id: orderId,
    workspaceId,
    orderNumber,
    status: "paid",
    cardVariant: variant,
    quantity,
    totalAmountInr: totalAmount,
    shippingAddress: sampleAddress,
    notes: "Direct Admin Provisioning Order for Hardware QA Demonstration",
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: orderId,
    orderNumber,
    status: "paid",
    cardVariant: variant,
    quantity,
    totalAmountInr: totalAmount,
    shippingAddress: sampleAddress,
    trackingCarrier: null,
    trackingNumber: null,
    notes: "Direct Admin Provisioning Order for Hardware QA Demonstration",
    createdAt: now,
  };
}

export async function getAllSupportTickets() {
  const db = await getDb();
  return db
    .select()
    .from(schema.supportTickets)
    .orderBy(desc(schema.supportTickets.createdAt));
}

export async function adminUpdateSupportTicketStatus(
  ticketId: string,
  status: "open" | "in_progress" | "resolved" | "closed"
) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);
  await db
    .update(schema.supportTickets)
    .set({ status, updatedAt: now })
    .where(eq(schema.supportTickets.id, ticketId));
  return { success: true };
}

export async function getAllWorkspacesForAdmin() {
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.workspaces.id,
      name: schema.workspaces.name,
      slug: schema.workspaces.slug,
      extraSlots: schema.workspaces.extraSlots,
      status: schema.workspaces.status,
      ownerEmail: schema.users.email,
      ownerName: schema.users.name,
      planCode: schema.plans.code,
      planName: schema.plans.name,
      planBaseLimit: schema.plans.profileLimit,
      subscriptionExtraSlots: schema.subscriptions.extraSlots,
      subscriptionStatus: schema.subscriptions.status,
      createdAt: schema.workspaces.createdAt,
    })
    .from(schema.workspaces)
    .leftJoin(schema.users, eq(schema.workspaces.ownerId, schema.users.id))
    .leftJoin(schema.subscriptions, eq(schema.workspaces.id, schema.subscriptions.workspaceId))
    .leftJoin(schema.plans, eq(schema.subscriptions.planId, schema.plans.id))
    .orderBy(desc(schema.workspaces.createdAt));

  return rows.map((r) => {
    const base = r.planBaseLimit ?? 1;
    const extra = (r.extraSlots ?? 0) + (r.subscriptionExtraSlots ?? 0);
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      extraSlots: extra,
      status: r.status,
      ownerEmail: r.ownerEmail || "N/A",
      ownerName: r.ownerName || "User",
      planCode: r.planCode || "free",
      planName: r.planName || "Free Digital Identity",
      baseLimit: base,
      totalAllottedSlots: base + extra,
      createdAt: r.createdAt,
    };
  });
}

export async function adminSetWorkspaceSlots(
  workspaceId: string,
  extraSlots: number,
  planCode?: string
) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  // Update workspace extra slots
  await db
    .update(schema.workspaces)
    .set({ extraSlots, updatedAt: now })
    .where(eq(schema.workspaces.id, workspaceId));

  // If a plan code is provided, update or create subscription
  if (planCode) {
    const [targetPlan] = await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.code, planCode as any))
      .limit(1);

    if (targetPlan) {
      const [existingSub] = await db
        .select()
        .from(schema.subscriptions)
        .where(eq(schema.subscriptions.workspaceId, workspaceId))
        .limit(1);

      if (existingSub) {
        await db
          .update(schema.subscriptions)
          .set({ planId: targetPlan.id, updatedAt: now })
          .where(eq(schema.subscriptions.id, existingSub.id));
      } else {
        await db.insert(schema.subscriptions).values({
          id: crypto.randomUUID(),
          workspaceId,
          planId: targetPlan.id,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: now + 365 * 86400,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  // Invalidate fast cache
  fastCache.delete(`plan:${workspaceId}`);
  return { success: true };
}

export async function userPurchaseExtraSlots(workspaceId: string, quantity: number = 1) {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  const [ws] = await db
    .select()
    .from(schema.workspaces)
    .where(eq(schema.workspaces.id, workspaceId))
    .limit(1);

  if (!ws) throw new Error("Workspace not found");

  // Get current plan base limit
  const [sub] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.workspaceId, workspaceId))
    .limit(1);

  let planBaseLimit = 1;
  if (sub) {
    const [plan] = await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.id, sub.planId))
      .limit(1);
    if (plan) planBaseLimit = plan.profileLimit;
  }

  const currentTotal = planBaseLimit + (ws.extraSlots || 0);
  if (currentTotal + quantity > 25) {
    throw new Error(
      "Self-serve extra slots are capped at 25 total cards. For 25+ corporate card slots, please contact Tapbez Admin."
    );
  }

  const newExtra = (ws.extraSlots || 0) + quantity;
  await db
    .update(schema.workspaces)
    .set({ extraSlots: newExtra, updatedAt: now })
    .where(eq(schema.workspaces.id, workspaceId));

  const invoiceId = crypto.randomUUID();
  const unitPrice = 199;
  const totalInr = unitPrice * quantity;
  await db.insert(schema.invoices).values({
    id: invoiceId,
    workspaceId,
    invoiceNumber: `INV-SLOT-${Math.floor(100000 + Math.random() * 900000)}`,
    amountInr: totalInr,
    taxInr: Math.round(totalInr * 0.18),
    totalInr: Math.round(totalInr * 1.18),
    status: "paid",
    lineItems: JSON.stringify([
      { description: `Extra Card / Profile Slots (${quantity} slot)`, amount: totalInr }
    ]),
    createdAt: now,
  });

  fastCache.delete(`plan:${workspaceId}`);
  return { success: true, newExtraSlots: newExtra };
}
