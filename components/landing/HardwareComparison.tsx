"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight,
  Cpu,
  RotateCw
} from "lucide-react";

interface FinishOption {
  id: string;
  name: string;
  accent: string;
  gradient: string;
  borderAccent: string;
}

const FINISH_OPTIONS: FinishOption[] = [
  {
    id: "obsidian",
    name: "Obsidian Noir",
    accent: "#f59e0b",
    gradient: "from-[#111622] via-[#090d15] to-[#04060a]",
    borderAccent: "border-amber-500/30",
  },
  {
    id: "sapphire",
    name: "Royal Sapphire",
    accent: "#3b82f6",
    gradient: "from-[#0c1f3d] via-[#061124] to-[#030814]",
    borderAccent: "border-blue-500/30",
  },
  {
    id: "titanium",
    name: "Titanium Slate",
    accent: "#94a3b8",
    gradient: "from-[#1e293b] via-[#0f172a] to-[#090d16]",
    borderAccent: "border-slate-400/30",
  },
  {
    id: "emerald",
    name: "Emerald Velvet",
    accent: "#10b981",
    gradient: "from-[#062c1e] via-[#031710] to-[#020b08]",
    borderAccent: "border-emerald-500/30",
  },
];

export function HardwareComparison() {
  const [activeFinish, setActiveFinish] = useState<FinishOption>(FINISH_OPTIONS[0]);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section id="hardware" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] overflow-hidden bg-[#030508]">
      {/* Background radial glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none rounded-full blur-[140px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle, ${activeFinish.accent} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-medium uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Industrial Precision Hardware</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Engineered to feel like <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              a luxury credit card
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Every TapSync card embeds an authenticated NXP high-frequency NFC transceiver with custom multi-layer antenna tuning for instantaneous sub-100ms coupling with any modern smartphone.
          </p>
        </motion.div>

        {/* 2-Column Comparison Showcase with Staggered Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card Option 1: Standard Gloss PVC */}
          <motion.div 
            className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 sm:p-8 lg:p-10 flex flex-col justify-between hover:border-white/[0.18] transition-all duration-300 group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Starter Physical</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Gloss Core PVC</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-3xl font-extrabold text-white">₹499</div>
                  <span className="text-[11px] sm:text-xs text-slate-400">One-time hardware</span>
                </div>
              </div>

              {/* Card Visual Preview */}
              <div className="w-full aspect-[1.586/1] max-w-[340px] sm:max-w-[380px] mx-auto my-6 sm:my-8 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-800 to-slate-950 p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:scale-[1.03] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between">
                  <div className="w-9 sm:w-10 h-6 sm:h-7 rounded bg-gradient-to-tr from-amber-300 to-yellow-600 border border-yellow-200/50 flex items-center justify-center">
                    <div className="w-5 sm:w-6 h-3.5 sm:h-4 border border-black/30 rounded-sm" />
                  </div>
                  <Wifi className="w-5 sm:w-6 h-5 sm:h-6 text-slate-300 rotate-90" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-mono">TapSync Core</div>
                  <div className="text-sm sm:text-base font-semibold text-white tracking-wider mt-1 font-mono">YOUR NAME HERE</div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6">
                High-density 0.76mm composite PVC with full-bleed gloss lamination. Designed for entry-level professionals who want contactless networking without compromise.
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-3 mb-8 border-t border-white/[0.06] pt-6">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>NXP NTAG213 High-Frequency Transponder</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>0.76mm ISO/IEC 7810 ID-1 standard thickness</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>High-gloss scratch-resistant surface shield</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dynamic profile cloud redirect included</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Integrated QR fallback reverse matrix</span>
                </li>
              </ul>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/register?tier=standard"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200"
              >
                <span>Order Gloss Core (₹499)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Card Option 2: Velvet Matte Luxe (Signature) */}
          <motion.div 
            className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] via-white/[0.03] to-black/60 p-5 sm:p-8 lg:p-10 flex flex-col justify-between shadow-[0_0_50px_rgba(245,158,11,0.12)] group mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Best Seller Badge with Pulse */}
            <motion.div 
              className="absolute -top-3.5 right-4 sm:right-8 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[#030508] font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5"
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#030508]" />
              <span>Flagship Velvet Matte</span>
            </motion.div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Executive Edition</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Velvet Matte PVC</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-3xl font-extrabold text-amber-400">₹999</div>
                  <span className="text-[11px] sm:text-xs text-slate-400">One-time hardware</span>
                </div>
              </div>

              {/* Finish Palette Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 border border-white/[0.08] rounded-xl p-2 gap-2 mb-6">
                <span className="text-xs text-slate-400 font-medium pl-1 sm:pl-2">Select Finish:</span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {FINISH_OPTIONS.map((finish) => (
                    <motion.button
                      key={finish.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveFinish(finish)}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                        activeFinish.id === finish.id 
                          ? "bg-white/15 text-white shadow-sm ring-1 ring-white/30" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      style={{
                        borderBottom: activeFinish.id === finish.id ? `2px solid ${finish.accent}` : "none"
                      }}
                    >
                      {finish.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Interactive Flip Preview with 3D Spring */}
              <div className="w-full aspect-[1.586/1] max-w-[380px] mx-auto my-4 perspective-1000">
                <motion.div 
                  className="w-full h-full rounded-2xl border p-6 flex flex-col justify-between shadow-2xl relative cursor-pointer overflow-hidden transform-style-3d group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
                  style={{
                    background: `linear-gradient(135deg, ${activeFinish.gradient.split(" ")[1]}, #030508)`,
                    borderColor: activeFinish.accent
                  }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  title="Click to flip preview"
                >
                  {/* Metallic foil shine sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent animate-specular pointer-events-none" />

                  {!isFlipped ? (
                    <div className="flex flex-col justify-between h-full backface-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        {/* Brushed Gold EMV Chip */}
                        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/60 shadow-md flex items-center justify-center">
                          <div className="w-7 h-5 border border-black/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                            <div className="bg-black/20 rounded-[1px]" />
                            <div className="bg-black/20 rounded-[1px]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-widest uppercase font-mono text-amber-400/80">Tap to Flip</span>
                          <RotateCw className="w-4 h-4 text-amber-400 rotate-90" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="text-[10px] uppercase tracking-widest text-slate-300 font-mono">Velvet Matte • NXP 216</div>
                        <div className="text-lg font-bold text-white tracking-wider mt-0.5 font-mono">ALEXANDER R. VANCE</div>
                        <div className="text-xs text-amber-300/90 font-mono mt-0.5">MANAGING PARTNER</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full relative z-10 text-center backface-hidden rotate-y-180">
                      <div className="h-7 w-full bg-black/80 rounded border border-white/10 flex items-center px-4">
                        <div className="h-2 w-32 bg-white/20 rounded" />
                      </div>
                      <div className="py-2">
                        <div className="w-14 h-14 mx-auto rounded-lg bg-white p-1 shadow-inner flex items-center justify-center">
                          <div className="w-12 h-12 bg-black rounded flex items-center justify-center text-[7px] text-white font-mono">
                            TAPSYNC QR
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">Dynamic Cloud Fallback QR</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        AUTHENTICATED HARDWARE ID: #TS-9982-LUXE
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <p className="text-slate-300 text-sm mb-6">
                Premium soft-touch anti-scratch velvet polymer with embedded NXP NTAG216 extended memory (888 bytes). Unrivaled luxury tactile feel with custom metallic foil stamp options.
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-3 mb-8 border-t border-white/[0.08] pt-6">
                <li className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">NXP NTAG216 High-Capacity Transceiver (888 bytes)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ultra-luxe matte soft-touch anti-fingerprint surface</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant 1-Click Remote Kill Switch & Profile Lock</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Lifetime hardware replacement guarantee</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free expedited delivery anywhere in India</span>
                </li>
              </ul>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register?tier=luxe"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-[#030508] font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-200"
              >
                <span>Order Velvet Matte (₹999)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

        </div>

        {/* Micro Guarantee Banner */}
        <motion.div 
          className="mt-12 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm sm:text-base">100,000 Tap Guarantee & Free Profile Hosting Forever</h4>
              <p className="text-slate-400 text-xs sm:text-sm">No mandatory subscription required to keep your basic digital business card active.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Zero Batteries</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>100% Water Resistant</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
