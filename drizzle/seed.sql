-- Seed Subscription Plans
INSERT OR REPLACE INTO plans (id, code, name, price_annual_inr, profile_limit, features, is_active) 
VALUES 
('plan_free', 'free', 'Free Digital Identity', 0, 1, '["1 Dynamic Digital Profile", "Instant vCard 1-Tap Save", "Downloadable Profile QR Code", "Standard Social & Bio Blocks", "Basic Scan Counter"]', 1),
('plan_standard_pvc', 'standard_pvc', 'Standard PVC NFC Card', 999, 3, '["Includes 1x Standard White PVC Card", "NXP High-Frequency NFC Transceiver", "Standard design selection", "3 Published Digital Profiles", "Tap-to-share & QR sharing", "Free Delivery Across India"]', 1),
('plan_custom_pvc', 'custom_pvc', 'Customized PVC NFC Card', 1499, 10, '["Includes 1x Customized PVC NFC Card", "Personalized Name & Brand Artwork", "Remove Tapbez Footer Branding", "10 Published Digital Profiles", "Appointment & Calendly Booking", "Live Tap Analytics & Telemetry"]', 1),
('plan_custom_metal', 'custom_metal', 'Customized Metal NFC Card', 1999, 25, '["Includes 1x Aerospace-Grade Metal Card", "Laser-Etched Custom Branding", "Remove Tapbez Footer Branding", "25 Published Digital Profiles", "Custom Corporate Domain Support", "Priority VIP Concierge Support"]', 1);
