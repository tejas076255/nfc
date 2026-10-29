import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { SlashTopBanner } from "@/components/landing/SlashTopBanner";
import { SlashNav } from "@/components/landing/SlashNav";
import { SlashHero } from "@/components/landing/SlashHero";
import { SlashLogoCloud } from "@/components/landing/SlashLogoCloud";
import { SlashBentoGrid } from "@/components/landing/SlashBentoGrid";
import { HardwareComparison } from "@/components/landing/HardwareComparison";
import { TemplatesShowcase } from "@/components/landing/TemplatesShowcase";
import { WhySwitchMatrix } from "@/components/landing/WhySwitchMatrix";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { SlashCta } from "@/components/landing/SlashCta";
import { SlashFooter } from "@/components/landing/SlashFooter";

export default async function HomePage() {
  const session = await getCurrentSession();

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* 1. Top Announcement Header */}
      <SlashTopBanner />

      {/* 2. Floating Frosted Glass Navbar */}
      <SlashNav sessionUser={session?.user} />

      {/* 3. Main Landing Experience */}
      <main>
        {/* Cinematic Hero with 3D Hardware Studio & Live Tap Simulator */}
        <SlashHero />

        {/* Enterprise & Tech Trust Logos */}
        <SlashLogoCloud />

        {/* Signature Slash Bento Grid (vCard Sync, Telemetry, Dynamic Profiles, Fleet Lock) */}
        <SlashBentoGrid />

        {/* Industrial Hardware Showcase (Velvet Matte PVC vs Standard PVC) */}
        <HardwareComparison />

        {/* 6 Curated Industry Design Systems */}
        <TemplatesShowcase />

        {/* Competitive Comparison Matrix */}
        <WhySwitchMatrix />

        {/* Transparent Software & Fleet Pricing */}
        <PricingSection />

        {/* Executive Proof & Verified ROI */}
        <TestimonialsSection />

        {/* Collapsible Accordion FAQ */}
        <FaqSection />

        {/* High-Conversion Bottom Callout Banner */}
        <SlashCta />
      </main>

      {/* 4. Fintech Precision Footer with Live System Uptime */}
      <SlashFooter />
    </div>
  );
}
