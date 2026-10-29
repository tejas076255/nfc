"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  price: {
    monthly: string;
    annual: string;
    period: string;
    hardwareNote: string;
  };
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  buttonClass: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Digital Solo",
    description: "Ideal for students and professionals wanting a free dynamic link-in-bio and digital QR card without physical hardware.",
    price: {
      monthly: "₹0",
      annual: "₹0",
      period: "forever",
      hardwareNote: "Digital card only (No NFC card)",
    },
    features: [
      "1 Dynamic Digital Profile",
      "Instant vCard 1-Tap Save",
      "Downloadable Profile QR Code",
      "Standard Social & Bio Blocks",
      "Basic Scan Counter",
      "Community Support",
    ],
    ctaText: "Create Free Profile",
    ctaHref: "/register?plan=free",
    buttonClass: "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
  },
  {
    id: "starter",
    name: "Starter Physical",
    description: "Physical Gloss Core PVC card with embedded NXP NTAG213 transceiver and lifetime digital profile hosting.",
    price: {
      monthly: "₹499",
      annual: "₹499",
      period: "one-time hardware",
      hardwareNote: "Includes 1 Gloss Core PVC Card",
    },
    features: [
      "Everything in Digital Solo",
      "1x Gloss Core PVC Smart Card",
      "NXP NTAG213 High-Frequency NFC",
      "Zero App Required for Tap",
      "Dynamic Cloud Profile Redirect",
      "Free Delivery Across India",
    ],
    ctaText: "Order Gloss Core (₹499)",
    ctaHref: "/register?plan=starter",
    buttonClass: "border border-white/20 bg-white/10 hover:bg-white/15 text-white",
  },
  {
    id: "luxe",
    name: "Velvet Matte Luxe",
    badge: "Most Popular",
    isPopular: true,
    description: "Our flagship soft-touch velvet card with extended NXP NTAG216 chip, advanced telemetry, and appointment booking.",
    price: {
      monthly: "₹999",
      annual: "₹999",
      period: "one-time hardware",
      hardwareNote: "Includes 1 Velvet Matte PVC Card",
    },
    features: [
      "Everything in Starter Physical",
      "1x Velvet Matte Soft-Touch Card",
      "NXP NTAG216 High-Capacity NFC (888B)",
      "Choice of 4 Luxury Finishes",
      "Cal.com & Calendly Integration",
      "Live Tap Analytics & Geo-telemetry",
      "Instant Remote Freeze Lock",
      "Priority Expedited Shipping",
    ],
    ctaText: "Order Velvet Matte (₹999)",
    ctaHref: "/register?plan=luxe",
    buttonClass: "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold shadow-[0_0_25px_rgba(245,158,11,0.4)]",
  },
  {
    id: "teams",
    name: "Corporate Enterprise",
    badge: "For Companies",
    description: "Centralized fleet management for enterprise sales teams, venture funds, and agencies needing custom branding.",
    price: {
      monthly: "₹1,499",
      annual: "₹1,199",
      period: "per user / card",
      hardwareNote: "Volume discounts available",
    },
    features: [
      "Everything in Velvet Matte Luxe",
      "Centralized Team Admin Console",
      "Bulk Card Provisioning & Reassignment",
      "Custom Corporate Domain (card.company.com)",
      "Salesforce & HubSpot CRM Sync",
      "Dedicated Account Concierge",
      "SLA & Hardware Replacement Guarantee",
    ],
    ctaText: "Contact Enterprise Sales",
    ctaHref: "/contact",
    buttonClass: "border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300",
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#030508] overflow-hidden">
      {/* Background radial glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header with Scroll Reveal */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-medium uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            One card. Infinite taps. <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Zero mandatory monthly fee.
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            Unlike other smart card companies that charge monthly subscription fees to keep your profile alive, TapSync cards function indefinitely.
          </p>

          {/* Interactive Billing Toggle with spring pill */}
          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md relative max-w-full">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 sm:px-5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all relative z-10 ${billingCycle === "monthly"
                  ? "text-black font-bold"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Standard Hardware
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billingTogglePill"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3.5 sm:px-5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 relative z-10 ${billingCycle === "annual"
                  ? "text-black font-bold"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <span>Annual Enterprise</span>
              <span className="text-[9px] sm:text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
              {billingCycle === "annual" && (
                <motion.div
                  layoutId="billingTogglePill"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full -z-10 shadow-md shadow-amber-500/20"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* 4 Pricing Cards Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${tier.isPopular
                  ? "border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/[0.08] via-white/[0.02] to-[#04060a] shadow-[0_0_40px_rgba(245,158,11,0.12)] scale-[1.02]"
                  : "border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-[#04060a] hover:border-white/20"
                }`}
            >
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${tier.isPopular
                    ? "bg-amber-400 text-black flex items-center gap-1 shadow-amber-500/30"
                    : "bg-white/10 text-white border border-white/20"
                  }`}>
                  {tier.isPopular && <Sparkles className="w-3 h-3 fill-black" />}
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 min-h-[36px]">{tier.description}</p>
                </div>

                {/* Price Display with AnimatePresence */}
                <div className="py-4 my-2 border-y border-white/[0.06]">
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={billingCycle}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="text-3xl sm:text-4xl font-extrabold text-white"
                      >
                        {billingCycle === "annual" ? tier.price.annual : tier.price.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-slate-400 font-mono">
                      /{tier.price.period}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-400/90 font-mono mt-1 block">
                    {tier.price.hardwareNote}
                  </span>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-3 my-6">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={tier.ctaHref}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 mt-4 ${tier.buttonClass}`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

            </motion.div>
          ))}
        </div>

        {/* Trust & Guarantee Banner */}
        <motion.div
          className="mt-16 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400" />
            <span>Zero App Install Required for Recipients</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-400" />
            <span>Ships in 24 Hours with Free India Delivery</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
