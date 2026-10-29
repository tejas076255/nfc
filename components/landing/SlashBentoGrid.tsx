"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Download,
  BarChart3,
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Cpu,
  Clock,
} from "lucide-react";

export function SlashBentoGrid() {
  const [activeProfile, setActiveProfile] = useState<"founder" | "counsel" | "investor">("founder");
  const [isLocked, setIsLocked] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "saving" | "done">("idle");

  const handleSimulateSave = () => {
    setDownloadState("saving");
    setTimeout(() => {
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 3500);
    }, 900);
  };

  const profiles = {
    founder: {
      title: "Founder & CEO",
      org: "TapSync Technologies",
      tagline: "Building hardware-software identity infrastructure",
      highlight: "from-amber-500 to-amber-600",
      accent: "text-amber-400",
      leads: 342,
    },
    counsel: {
      title: "Senior Corporate Counsel",
      org: "Vertex Advisory LLP",
      tagline: "Cross-border M&A and venture capital advisory",
      highlight: "from-blue-500 to-indigo-600",
      accent: "text-blue-400",
      leads: 189,
    },
    investor: {
      title: "Angel Syndicate Partner",
      org: "Horizon Ventures",
      tagline: "Backing Seed & Pre-Series A developer infrastructure",
      highlight: "from-purple-500 to-pink-600",
      accent: "text-purple-400",
      leads: 520,
    },
  };

  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background glow */}
      <motion.div 
        className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[170px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Section Header with Scroll Reveal */}
      <motion.div 
        className="text-center max-w-2xl mx-auto mb-16 space-y-3.5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pill-badge text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Engineered Like Modern Fintech. <br />
          <span className="gradient-text-slash">Modular by Design.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Slash-grade craftsmanship applied to physical and digital business cards. Everything you need to network, convert, and scale.
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CARD 1: Large Span (col-span-12 md:col-span-8) - Instant vCard Engine */}
        <motion.div 
          className="md:col-span-8 bento-card p-6 sm:p-8 flex flex-col justify-between group"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>0.4s Direct Transmission</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                NO APP REQUIRED
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              One Tap. Zero Friction. Instant Phonebook Save.
            </h3>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              When someone taps your card, your contact details, portfolio links, social handles, and direct downloadable vCard appear instantaneously. No typing, no typos, no lost business cards.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="mt-8 p-5 rounded-2xl bg-[#060912]/90 border border-white/[0.08] relative overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/20 shrink-0">
                  SM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Siddharth Mehta</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xs text-slate-400">
                    siddharth@vertexadvisory.com • +91 98201 44829
                  </div>
                </div>
              </div>

              {/* Action Button with spring tap */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleSimulateSave}
                disabled={downloadState !== "idle"}
                className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                  downloadState === "done"
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : downloadState === "saving"
                    ? "bg-slate-700 text-slate-300"
                    : "btn-primary-glow"
                }`}
              >
                {downloadState === "done" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Contact Saved to Phone!</span>
                  </>
                ) : downloadState === "saving" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Wifi className="w-3.5 h-3.5 rotate-90" />
                    </motion.div>
                    <span>Generating vCard 4.0...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download vCard (.vcf)</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Micro Details strip */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compatible with iOS Contacts & Google Address Book</span>
              </div>
              <span className="font-mono text-slate-500">vCard 3.0 / 4.0 Standard</span>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: Analytics & Telemetry (col-span-12 md:col-span-4) */}
        <motion.div 
          className="md:col-span-4 bento-card p-6 sm:p-7 flex flex-col justify-between"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Real-Time Telemetry
              </span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Scan & Tap Analytics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Know exactly when and where your cards are tapped. Track conversion rates and compare NFC vs QR scans.
            </p>
          </div>

          {/* Mini Visual Metric Widget */}
          <div className="mt-6 space-y-3 p-4 rounded-xl bg-[#060912]/95 border border-white/[0.08]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-white">1,842</span>
                <span className="text-[11px] text-slate-400 ml-1">total taps</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                <span>+24.6%</span>
              </span>
            </div>

            {/* Mini Animated SVG Sparkline */}
            <div className="h-9 w-full flex items-end pt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" fill="none">
                <motion.path
                  d="M0 20 L15 17 L30 19 L45 11 L60 14 L75 6 L90 8 L100 2"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <path
                  d="M0 20 L15 17 L30 19 L45 11 L60 14 L75 6 L90 8 L100 2 L100 24 L0 24 Z"
                  fill="url(#sparkline-gradient)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Physical NFC Chip</span>
                  <span className="font-mono text-slate-300">76%</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "76%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Laser-Etched QR</span>
                  <span className="font-mono text-slate-300">24%</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "24%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: Multi-Profile Switcher (col-span-12 md:col-span-5) */}
        <motion.div 
          className="md:col-span-5 bento-card p-6 sm:p-7 flex flex-col justify-between"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                Dynamic Routing
              </span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>

            <h3 className="text-xl font-bold text-white">
              1 Physical Card. Infinite Identities.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch what your physical card displays in real-time from your phone. No need to carry multiple cards for different roles.
            </p>
          </div>

          {/* Interactive Profile Switcher */}
          <div className="mt-6 space-y-3">
            {/* Tab Buttons */}
            <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] gap-1 relative">
              {(["founder", "counsel", "investor"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveProfile(role)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all relative z-10 ${
                    activeProfile === role
                      ? "text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                  type="button"
                >
                  {role}
                  {activeProfile === role && (
                    <motion.div
                      layoutId="activeBentoTab"
                      className="absolute inset-0 bg-white rounded-lg -z-10 shadow-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Profile Preview Card */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeProfile}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="p-4 rounded-xl bg-[#060912]/95 border border-white/[0.08] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {profiles[activeProfile].title}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ACTIVE ROUTE</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {profiles[activeProfile].org}
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  &ldquo;{profiles[activeProfile].tagline}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CARD 4: Enterprise Remote Lock & Fleet (col-span-12 md:col-span-4) */}
        <motion.div 
          className="md:col-span-4 bento-card p-6 sm:p-7 flex flex-col justify-between"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Fleet Security
              </span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Instant Card Freeze
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lost your card at an airport or conference? Freeze the NDEF payload with 1 click. Zero privacy leakage.
            </p>
          </div>

          {/* Interactive Freeze Switcher */}
          <div className="mt-6 p-4 rounded-xl bg-[#060912]/95 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isLocked ? (
                  <Lock className="w-4 h-4 text-red-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-semibold text-white">
                  Status: {isLocked ? "FROZEN" : "ACTIVE"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsLocked(!isLocked)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm ${
                  isLocked
                    ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                }`}
              >
                {isLocked ? "Unfreeze Card" : "Freeze Card"}
              </motion.button>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed">
              {isLocked
                ? "Card is frozen. Anyone tapping will see a privacy protection screen."
                : "Card is active. Taps will route seamlessly to your published profile."}
            </div>
          </div>
        </motion.div>

        {/* CARD 5: Genuine NTAG213 Microchip (col-span-12 md:col-span-3) */}
        <motion.div 
          className="md:col-span-3 bento-card p-6 sm:p-7 flex flex-col justify-between"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Hardware
              </span>
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>

            <h3 className="text-xl font-bold text-white">
              NTAG213 Certified
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Genuine NXP semiconductor chips. 100,000+ read/write cycles. Zero battery or charging ever needed.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/[0.06] space-y-2 text-[11px] text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Frequency:</span>
              <span className="text-amber-400">13.56 MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operating Range:</span>
              <span>Up to 40 mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lifespan:</span>
              <span>10+ Years</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
