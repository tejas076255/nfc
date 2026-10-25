CREATE TABLE `analytics_daily_aggregates` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`date` text NOT NULL,
	`profile_views` integer DEFAULT 0 NOT NULL,
	`nfc_opens` integer DEFAULT 0 NOT NULL,
	`qr_opens` integer DEFAULT 0 NOT NULL,
	`contact_clicks` integer DEFAULT 0 NOT NULL,
	`whatsapp_clicks` integer DEFAULT 0 NOT NULL,
	`leads_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_analytics_daily_unique` ON `analytics_daily_aggregates` (`workspace_id`,`profile_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_analytics_daily_date` ON `analytics_daily_aggregates` (`date`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`event_type` text NOT NULL,
	`source_token` text,
	`source_type` text,
	`ip_hash` text,
	`user_agent` text,
	`is_bot` integer DEFAULT 0 NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_workspace` ON `analytics_events` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_analytics_profile` ON `analytics_events` (`profile_id`);--> statement-breakpoint
CREATE INDEX `idx_analytics_type` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `idx_analytics_timestamp` ON `analytics_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text,
	`actor_id` text NOT NULL,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`metadata` text,
	`ip_address` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_workspace` ON `audit_logs` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_actor` ON `audit_logs` (`actor_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_created_at` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `card_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	`assigned_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_card_assignments_card` ON `card_assignments` (`card_id`);--> statement-breakpoint
CREATE INDEX `idx_card_assignments_profile` ON `card_assignments` (`profile_id`);--> statement-breakpoint
CREATE TABLE `card_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`claim_secret_hash` text NOT NULL,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`max_attempts` integer DEFAULT 5 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`claimed_by_user_id` text,
	`claimed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`claimed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_card_claims_card` ON `card_claims` (`card_id`);--> statement-breakpoint
CREATE INDEX `idx_card_claims_hash` ON `card_claims` (`claim_secret_hash`);--> statement-breakpoint
CREATE TABLE `card_qa_records` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`operator_id` text NOT NULL,
	`step` text NOT NULL,
	`result` text NOT NULL,
	`readback_url` text,
	`verified_qr_token` text,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`operator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_card_qa_card` ON `card_qa_records` (`card_id`);--> statement-breakpoint
CREATE INDEX `idx_card_qa_operator` ON `card_qa_records` (`operator_id`);--> statement-breakpoint
CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text,
	`public_token` text NOT NULL,
	`claim_secret_hash` text,
	`product_variant` text DEFAULT 'standard_pvc' NOT NULL,
	`print_design_data` text,
	`active_profile_id` text,
	`inventory_status` text DEFAULT 'received' NOT NULL,
	`activation_status` text DEFAULT 'unassigned' NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`active_profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cards_public_token_unique` ON `cards` (`public_token`);--> statement-breakpoint
CREATE INDEX `idx_cards_token` ON `cards` (`public_token`);--> statement-breakpoint
CREATE INDEX `idx_cards_workspace_id` ON `cards` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_cards_active_profile` ON `cards` (`active_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_cards_activation_status` ON `cards` (`activation_status`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`order_id` text,
	`subscription_id` text,
	`invoice_number` text NOT NULL,
	`amount_inr` integer NOT NULL,
	`tax_inr` integer DEFAULT 0 NOT NULL,
	`total_inr` integer NOT NULL,
	`status` text DEFAULT 'paid' NOT NULL,
	`line_items` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `idx_invoices_workspace` ON `invoices` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_number` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `lead_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_lead_notes_lead_id` ON `lead_notes` (`lead_id`);--> statement-breakpoint
CREATE TABLE `lead_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`old_status` text NOT NULL,
	`new_status` text NOT NULL,
	`changed_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_lead_status_history_lead` ON `lead_status_history` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`visitor_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`message` text,
	`service_interest` text,
	`status` text DEFAULT 'new' NOT NULL,
	`source_type` text DEFAULT 'direct' NOT NULL,
	`source_card_id` text,
	`source_qr_id` text,
	`contact_consent` integer DEFAULT 1 NOT NULL,
	`contact_consent_version` text DEFAULT 'v1' NOT NULL,
	`marketing_consent` integer DEFAULT 0 NOT NULL,
	`submission_key` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`source_qr_id`) REFERENCES `qr_codes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_submission_key_unique` ON `leads` (`submission_key`);--> statement-breakpoint
CREATE INDEX `idx_leads_workspace_id` ON `leads` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_leads_profile_id` ON `leads` (`profile_id`);--> statement-breakpoint
CREATE INDEX `idx_leads_status` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `idx_leads_source_type` ON `leads` (`source_type`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`order_number` text NOT NULL,
	`total_amount_inr` integer NOT NULL,
	`status` text DEFAULT 'paid' NOT NULL,
	`card_variant` text DEFAULT 'standard_pvc' NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`shipping_address` text NOT NULL,
	`tracking_carrier` text,
	`tracking_number` text,
	`notes` text,
	`razorpay_order_id` text,
	`razorpay_payment_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `idx_orders_workspace` ON `orders` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_orders_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`price_annual_inr` integer NOT NULL,
	`profile_limit` integer NOT NULL,
	`features` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_code_unique` ON `plans` (`code`);--> statement-breakpoint
CREATE TABLE `profile_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`type` text NOT NULL,
	`is_enabled` integer DEFAULT 1 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`block_data` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_profile_blocks_profile_id` ON `profile_blocks` (`profile_id`);--> statement-breakpoint
CREATE INDEX `idx_profile_blocks_sort` ON `profile_blocks` (`profile_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `profile_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`content` text NOT NULL,
	`theme_config` text NOT NULL,
	`published_by` text NOT NULL,
	`published_at` integer NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_profile_versions_profile_id` ON `profile_versions` (`profile_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_profile_version_num` ON `profile_versions` (`profile_id`,`version_number`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`bio` text,
	`industry` text DEFAULT 'professional' NOT NULL,
	`template_id` text DEFAULT 'corporate_slate' NOT NULL,
	`theme_config` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`search_indexed` integer DEFAULT 0 NOT NULL,
	`fallback_preference` integer DEFAULT 0 NOT NULL,
	`published_version_id` text,
	`views_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_slug_unique` ON `profiles` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_profiles_workspace_id` ON `profiles` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_profiles_slug` ON `profiles` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_profiles_status` ON `profiles` (`status`);--> statement-breakpoint
CREATE TABLE `qr_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`token` text NOT NULL,
	`title` text NOT NULL,
	`campaign` text,
	`is_active` integer DEFAULT 1 NOT NULL,
	`scan_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `qr_codes_token_unique` ON `qr_codes` (`token`);--> statement-breakpoint
CREATE INDEX `idx_qr_token` ON `qr_codes` (`token`);--> statement-breakpoint
CREATE INDEX `idx_qr_workspace_id` ON `qr_codes` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_qr_profile_id` ON `qr_codes` (`profile_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_token_hash` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`current_period_start` integer NOT NULL,
	`current_period_end` integer NOT NULL,
	`grace_period_end` integer,
	`fallback_profile_id` text,
	`razorpay_subscription_id` text,
	`razorpay_customer_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fallback_profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_subscriptions_workspace` ON `subscriptions` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_status` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`avatar_url` text,
	`email_verified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE TABLE `workspace_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_workspace_memberships_unique` ON `workspace_memberships` (`workspace_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workspace_memberships_user` ON `workspace_memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workspace_memberships_ws` ON `workspace_memberships` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text DEFAULT 'personal' NOT NULL,
	`owner_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_slug_unique` ON `workspaces` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_workspaces_owner_id` ON `workspaces` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_workspaces_slug` ON `workspaces` (`slug`);