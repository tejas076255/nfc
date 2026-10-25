-- Seed Subscription Plans
INSERT OR IGNORE INTO plans (id, code, name, price_annual_inr, profile_limit, features, is_active) 
VALUES 
('plan_free', 'free', 'Free Digital Identity', 0, 1, '["1 Published Digital Profile", "Direct Profile QR Code", "Downloadable vCard (.vcf)", "Native Lead Capture Inbox", "Unlimited Valid Leads"]', 1),
('plan_starter', 'starter', 'Starter Plan', 499, 3, '["3 Published Digital Profiles", "All 6 Industry Templates", "Custom Themes and Accents", "Trackable QR Tokens", "Basic Analytics and CSV Export"]', 1),
('plan_professional', 'professional', 'Professional Plan', 999, 10, '["10 Published Digital Profiles", "All Industry Templates", "Enhanced Custom Branding", "Full NFC and QR Source Attribution", "Longer Analytics History"]', 1),
('plan_biz_pro', 'business_pro', 'Business Pro', 2499, 25, '["25 Published Digital Profiles", "Full Template and Block Access", "Advanced Team-Ready Analytics", "Priority Support and Ops Dispatch", "Unlimited Lead Exports"]', 1);
