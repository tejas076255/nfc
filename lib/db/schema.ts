import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// Users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["user", "ops_staff", "support_staff", "super_admin"] }).notNull().default("user"),
  avatarUrl: text("avatar_url"),
  emailVerifiedAt: integer("email_verified_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_users_email").on(table.email),
  index("idx_users_role").on(table.role),
]);

// Sessions
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_sessions_user_id").on(table.userId),
  index("idx_sessions_token_hash").on(table.tokenHash),
]);

// Workspaces
export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["personal", "organization", "reseller"] }).notNull().default("personal"),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_workspaces_owner_id").on(table.ownerId),
  index("idx_workspaces_slug").on(table.slug),
]);

// Workspace Memberships
export const workspaceMemberships = sqliteTable("workspace_memberships", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "member", "reseller_agent"] }).notNull().default("owner"),
  status: text("status", { enum: ["active", "invited", "suspended"] }).notNull().default("active"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_workspace_memberships_unique").on(table.workspaceId, table.userId),
  index("idx_workspace_memberships_user").on(table.userId),
  index("idx_workspace_memberships_ws").on(table.workspaceId),
]);

// Profiles
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  bio: text("bio"),
  industry: text("industry", {
    enum: ["professional", "beauty", "real_estate", "creative", "local_business", "creator"],
  }).notNull().default("professional"),
  templateId: text("template_id").notNull().default("corporate_slate"),
  themeConfig: text("theme_config").notNull(), // JSON
  status: text("status", {
    enum: ["draft", "published", "unpublished", "suspended", "archived"],
  }).notNull().default("draft"),
  searchIndexed: integer("search_indexed").notNull().default(0),
  fallbackPreference: integer("fallback_preference").notNull().default(0),
  publishedVersionId: text("published_version_id"),
  viewsCount: integer("views_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_profiles_workspace_id").on(table.workspaceId),
  index("idx_profiles_slug").on(table.slug),
  index("idx_profiles_status").on(table.status),
]);

// Profile Versions
export const profileVersions = sqliteTable("profile_versions", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(), // JSON snapshot
  themeConfig: text("theme_config").notNull(), // JSON
  publishedBy: text("published_by").notNull().references(() => users.id),
  publishedAt: integer("published_at").notNull(),
}, (table) => [
  index("idx_profile_versions_profile_id").on(table.profileId),
  uniqueIndex("idx_profile_version_num").on(table.profileId, table.versionNumber),
]);

// Profile Blocks
export const profileBlocks = sqliteTable("profile_blocks", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  isEnabled: integer("is_enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  blockData: text("block_data").notNull(), // JSON
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_profile_blocks_profile_id").on(table.profileId),
  index("idx_profile_blocks_sort").on(table.profileId, table.sortOrder),
]);

// Cards
export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, { onDelete: "set null" }),
  publicToken: text("public_token").notNull().unique(), // short opaque token for /t/[token]
  claimSecretHash: text("claim_secret_hash"),
  productVariant: text("product_variant", { enum: ["standard_pvc", "matte_pvc"] }).notNull().default("standard_pvc"),
  printDesignData: text("print_design_data"), // JSON
  activeProfileId: text("active_profile_id").references(() => profiles.id, { onDelete: "set null" }),
  inventoryStatus: text("inventory_status", {
    enum: [
      "received", "reserved", "printed", "encode_pending", "encoded",
      "qa_pass", "ready_to_ship", "shipped", "delivered", "qa_fail", "quarantined", "scrapped"
    ],
  }).notNull().default("received"),
  activationStatus: text("activation_status", {
    enum: ["unassigned", "claimable", "active", "disabled", "revoked"],
  }).notNull().default("unassigned"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_cards_token").on(table.publicToken),
  index("idx_cards_workspace_id").on(table.workspaceId),
  index("idx_cards_active_profile").on(table.activeProfileId),
  index("idx_cards_activation_status").on(table.activationStatus),
]);

// Card Assignments
export const cardAssignments = sqliteTable("card_assignments", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  validFrom: integer("valid_from").notNull(),
  validTo: integer("valid_to"),
  assignedBy: text("assigned_by").notNull().references(() => users.id),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_card_assignments_card").on(table.cardId),
  index("idx_card_assignments_profile").on(table.profileId),
]);

// Card Claims
export const cardClaims = sqliteTable("card_claims", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  claimSecretHash: text("claim_secret_hash").notNull(),
  attemptCount: integer("attempt_count").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(5),
  status: text("status", { enum: ["pending", "claimed", "expired", "locked"] }).notNull().default("pending"),
  claimedByUserId: text("claimed_by_user_id").references(() => users.id),
  claimedAt: integer("claimed_at"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_card_claims_card").on(table.cardId),
  index("idx_card_claims_hash").on(table.claimSecretHash),
]);

// Card QA Records
export const cardQaRecords = sqliteTable("card_qa_records", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  operatorId: text("operator_id").notNull().references(() => users.id),
  step: text("step", { enum: ["ndef_readback", "qr_mapping", "visual_print", "final_pass"] }).notNull(),
  result: text("result", { enum: ["pass", "fail"] }).notNull(),
  readbackUrl: text("readback_url"),
  verifiedQrToken: text("verified_qr_token"),
  notes: text("notes"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_card_qa_card").on(table.cardId),
  index("idx_card_qa_operator").on(table.operatorId),
]);

// QR Codes
export const qrCodes = sqliteTable("qr_codes", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // short opaque token for /q/[token]
  title: text("title").notNull(),
  campaign: text("campaign"),
  isActive: integer("is_active").notNull().default(1),
  scanCount: integer("scan_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_qr_token").on(table.token),
  index("idx_qr_workspace_id").on(table.workspaceId),
  index("idx_qr_profile_id").on(table.profileId),
]);

// Leads
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  visitorName: text("visitor_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message"),
  serviceInterest: text("service_interest"),
  status: text("status", { enum: ["new", "contacted", "qualified", "converted", "closed"] }).notNull().default("new"),
  sourceType: text("source_type", { enum: ["nfc", "qr", "direct", "campaign", "unknown"] }).notNull().default("direct"),
  sourceCardId: text("source_card_id").references(() => cards.id, { onDelete: "set null" }),
  sourceQrId: text("source_qr_id").references(() => qrCodes.id, { onDelete: "set null" }),
  contactConsent: integer("contact_consent").notNull().default(1),
  contactConsentVersion: text("contact_consent_version").notNull().default("v1"),
  marketingConsent: integer("marketing_consent").notNull().default(0),
  submissionKey: text("submission_key").unique(), // idempotency key
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_leads_workspace_id").on(table.workspaceId),
  index("idx_leads_profile_id").on(table.profileId),
  index("idx_leads_status").on(table.status),
  index("idx_leads_source_type").on(table.sourceType),
]);

// Lead Notes
export const leadNotes = sqliteTable("lead_notes", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_lead_notes_lead_id").on(table.leadId),
]);

// Lead Status History
export const leadStatusHistory = sqliteTable("lead_status_history", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  oldStatus: text("old_status").notNull(),
  newStatus: text("new_status").notNull(),
  changedBy: text("changed_by").notNull().references(() => users.id),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_lead_status_history_lead").on(table.leadId),
]);

// Analytics Events
export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  eventType: text("event_type", {
    enum: [
      "profile_view", "nfc_open", "qr_open",
      "save_contact_click", "whatsapp_click", "phone_click", "email_click", "lead_submitted"
    ],
  }).notNull(),
  sourceToken: text("source_token"),
  sourceType: text("source_type"),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  isBot: integer("is_bot").notNull().default(0),
  timestamp: integer("timestamp").notNull(),
}, (table) => [
  index("idx_analytics_workspace").on(table.workspaceId),
  index("idx_analytics_profile").on(table.profileId),
  index("idx_analytics_type").on(table.eventType),
  index("idx_analytics_timestamp").on(table.timestamp),
]);

// Analytics Daily Aggregates
export const analyticsDailyAggregates = sqliteTable("analytics_daily_aggregates", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  profileViews: integer("profile_views").notNull().default(0),
  nfcOpens: integer("nfc_opens").notNull().default(0),
  qrOpens: integer("qr_opens").notNull().default(0),
  contactClicks: integer("contact_clicks").notNull().default(0),
  whatsappClicks: integer("whatsapp_clicks").notNull().default(0),
  leadsCount: integer("leads_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_analytics_daily_unique").on(table.workspaceId, table.profileId, table.date),
  index("idx_analytics_daily_date").on(table.date),
]);

// Plans
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  code: text("code", { enum: ["free", "starter", "professional", "business_pro"] }).notNull().unique(),
  name: text("name").notNull(),
  priceAnnualInr: integer("price_annual_inr").notNull(),
  profileLimit: integer("profile_limit").notNull(),
  features: text("features").notNull(), // JSON
  isActive: integer("is_active").notNull().default(1),
});

// Subscriptions
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull().references(() => plans.id),
  status: text("status", { enum: ["active", "past_due", "grace", "expired", "cancelled"] }).notNull().default("active"),
  currentPeriodStart: integer("current_period_start").notNull(),
  currentPeriodEnd: integer("current_period_end").notNull(),
  gracePeriodEnd: integer("grace_period_end"),
  fallbackProfileId: text("fallback_profile_id").references(() => profiles.id),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  razorpayCustomerId: text("razorpay_customer_id"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_subscriptions_workspace").on(table.workspaceId),
  index("idx_subscriptions_status").on(table.status),
]);

// Orders
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  totalAmountInr: integer("total_amount_inr").notNull(),
  status: text("status", {
    enum: [
      "draft", "payment_pending", "paid", "production", "qa",
      "ready_to_ship", "shipped", "delivered", "failed", "refunded"
    ],
  }).notNull().default("paid"),
  cardVariant: text("card_variant", { enum: ["standard_pvc", "matte_pvc"] }).notNull().default("standard_pvc"),
  quantity: integer("quantity").notNull().default(1),
  shippingAddress: text("shipping_address").notNull(), // JSON
  trackingCarrier: text("tracking_carrier"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_orders_workspace").on(table.workspaceId),
  index("idx_orders_status").on(table.status),
  index("idx_orders_number").on(table.orderNumber),
]);

// Invoices
export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
  subscriptionId: text("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amountInr: integer("amount_inr").notNull(),
  taxInr: integer("tax_inr").notNull().default(0),
  totalInr: integer("total_inr").notNull(),
  status: text("status", { enum: ["paid", "refunded"] }).notNull().default("paid"),
  lineItems: text("line_items").notNull(), // JSON
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_invoices_workspace").on(table.workspaceId),
  index("idx_invoices_number").on(table.invoiceNumber),
]);

// Audit Logs
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  actorId: text("actor_id").notNull(),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  metadata: text("metadata"), // JSON
  ipAddress: text("ip_address"),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_audit_logs_workspace").on(table.workspaceId),
  index("idx_audit_logs_actor").on(table.actorId),
  index("idx_audit_logs_created_at").on(table.createdAt),
]);
