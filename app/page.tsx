import React from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/session";
import { NfcCardPreview } from "@/components/cards/NfcCardPreview";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import {
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Users,
  Layers,
  BarChart3,
  Smartphone,
  ChevronRight,
  QrCode,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const session = await getCurrentSession();

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Wifi className="w-5 h-5 text-white rotate-90" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TapSync<span className="text-blue-500">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#cards" className="hover:text-white transition-colors">
              Physical NFC Cards
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all whitespace-nowrap"
                >
                  <span className="sm:hidden">Start Free</span>
                  <span className="hidden sm:inline">Get Started Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Hybrid NFC Identity Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              The Smart NFC Card <br />
              <span className="gradient-text">That Never Expires.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tap on any smartphone to share your professional profile, services, and instant downloadable vCard. No app required. Track taps, capture leads, and update details anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/25 transition-all"
              >
                <span>Create Free Digital Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#cards"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>Order Physical NFC Card</span>
              </a>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-400 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Works with iPhone & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Subscription Required</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Card Simulation Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="glass-card rounded-3xl p-6 sm:p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Live Interactive Demo
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Tap to Flip
                  </span>
                </div>

                <NfcCardPreview
                  name="Siddharth Mehta"
                  title="Senior Corporate Counsel"
                  company="Vertex Legal Advisory"
                  variant="matte_pvc"
                  colorPalette="noir_gold"
                  isInteractive={true}
                />

                <p className="text-[11px] text-slate-500 text-center mt-4">
                  Interact with the 3D card above to flip between front and back or simulate an NFC tap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 border-t border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Seamless Networking
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              How TapSync Works in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No apps to download, no clunky QR-only scans. True contactless exchange in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Tap or Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hold your TapSync card against any smartphone. The embedded NFC chip triggers an immediate HTTPS redirect to your identity profile.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Instant vCard Download</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                With a single tap, visitors can download your full contact card (.vcf) directly into their phonebook without filling out forms or logging in.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Two-Way Lead Capture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visitors can voluntarily submit their own contact details. Leads arrive in your inbox with source attribution (NFC card vs QR vs direct).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIX INDUSTRY TEMPLATES SHOWCASE */}
      <section id="templates" className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Curated Design Systems
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              6 Reusable Industry Template Families
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Switching templates preserves all your profile blocks and data with zero loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => (
              <div
                key={tmpl.id}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                      {tmpl.industry.replace("_", " ")}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {tmpl.name}
                  </h3>

                  <p className="text-xs font-medium text-slate-300">
                    {tmpl.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Includes {tmpl.defaultBlocks.length} curated blocks
                  </span>
                  <Link
                    href={`/register?industry=${tmpl.industry}`}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Use Template</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHYSICAL CARDS HARDWARE SHOWCASE */}
      <section id="cards" className="py-24 border-t border-white/10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Premium Hardware
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Engineered Physical NFC Cards
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              ISO standard dimensions (85.6 × 54 mm, 0.76 mm). Embedded with genuine NTAG213 chips with read-back verification before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard PVC */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">Standard PVC NFC</h3>
                    <p className="text-xs text-slate-400">Classic high-gloss finish</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹499</span>
                    <span className="text-[11px] text-slate-400 block">one-time</span>
                  </div>
                </div>

                <div className="py-4">
                  <NfcCardPreview
                    name="Standard PVC"
                    title="Classic Edition"
                    variant="standard_pvc"
                    colorPalette="royal_sapphire"
                    isInteractive={false}
                  />
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Durable high-gloss waterproof PVC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Embedded NTAG213 microchip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>High-contrast printed QR backup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>NDEF read-back QA certified before dispatch</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href="/orders/new?variant=standard_pvc"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Customize & Order Standard (₹499)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Premium Matte PVC */}
            <div className="glass-card rounded-3xl p-8 border-2 border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">Premium Matte PVC</h3>
                    <p className="text-xs text-amber-400/90 font-medium">Soft-touch velvet finish</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹999</span>
                    <span className="text-[11px] text-slate-400 block">one-time</span>
                  </div>
                </div>

                <div className="py-4">
                  <NfcCardPreview
                    name="Matte Luxe"
                    title="Executive Edition"
                    variant="matte_pvc"
                    colorPalette="noir_gold"
                    isInteractive={false}
                  />
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Velvet soft-touch matte anti-fingerprint finish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Premium weighted core & metallic foil accents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Precision laser-aligned QR code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Full 100% replacement warranty on chip defect</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href="/orders/new?variant=matte_pvc"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <span>Customize & Order Matte (₹999)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Annual Software Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              All plans include unlimited valid lead submissions. Even if a paid subscription expires, your selected basic profile stays published.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Free Identity</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹0</span>
                    <span className="text-xs text-slate-400">/year</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">For individuals starting out</p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>1 Published Profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Downloadable vCard (.vcf)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Direct Profile QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Native Lead Inbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Unlimited Valid Leads</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold text-center block transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Starter */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Starter</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹499</span>
                    <span className="text-xs text-slate-400">/year</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">For freelancers & solo pros</p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>3 Published Profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>All 6 Industry Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Custom Color Palettes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Trackable QR Tokens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Basic Analytics & CSV Export</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=starter"
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center block transition-colors"
              >
                Upgrade to Starter
              </Link>
            </div>

            {/* Professional */}
            <div className="glass-card rounded-2xl p-6 border-2 border-blue-500/40 flex flex-col justify-between relative">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Professional</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹999</span>
                    <span className="text-xs text-slate-400">/year</span>
                  </div>
                  <p className="text-[11px] text-blue-400 font-medium mt-1">Recommended for business owners</p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>10 Published Profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Enhanced Custom Branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>NFC vs QR Source Attribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Full Analytics Trends</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Unlimited Lead Exports</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=professional"
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center block transition-colors shadow-lg shadow-blue-500/25"
              >
                Get Professional
              </Link>
            </div>

            {/* Business Pro */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Business Pro</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹2,499</span>
                    <span className="text-xs text-slate-400">/year</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">For multi-brand agencies & firms</p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>25 Published Profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>All Blocks & Custom Embeds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Advanced Team Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Priority Card Fulfillment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=business_pro"
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold text-center block transition-colors"
              >
                Choose Business Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 border-t border-white/10 bg-slate-950/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear, transparent answers on hardware compatibility, ownership, and subscriptions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Does the person tapping my card need to have an app installed?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. Both iPhone (iPhone 7 and newer) and all modern Android devices have native NFC hardware enabled by default. Tapping the card opens your profile immediately in their default browser.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Can I change my phone number or links after my card is printed?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! Your physical NFC card is programmed with a secure, permanent redirect URL. When you update your details, services, or phone number in your TapSync dashboard, visitors instantly see the updated information. You never need to reprint your card.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                What happens if my annual software subscription expires?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never destroy customer data or strand your physical card. If an annual paid plan expires, your selected eligible basic profile remains published and active, and your physical card continues redirecting seamlessly.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                What happens if I lose my card?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can immediately disable your card from your dashboard with one click. This revokes the server-side redirect within seconds, ensuring no one can access your profile through that physical card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Wifi className="w-3.5 h-3.5 rotate-90" />
          </div>
          <span className="font-bold text-slate-300">TapSync NFC SaaS</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a href="#templates" className="hover:text-slate-300 transition-colors">
            Templates
          </a>
          <a href="#cards" className="hover:text-slate-300 transition-colors">
            Cards
          </a>
          <a href="#pricing" className="hover:text-slate-300 transition-colors">
            Pricing
          </a>
          <Link href="/login" className="hover:text-slate-300 transition-colors">
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
