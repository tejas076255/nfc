"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function SlashHero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* 1. Background Video (GPU-accelerated, zero compositor blocking) */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 transform-gpu will-change-transform"
        src="/product_advertisement.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
      />

      {/* 2. Cinematic Overlays for Perfect Contrast & 60/120fps Smoothness */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-[#030508]/75 to-[#030508]/50 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-black/45 pointer-events-none z-[1]" />

      {/* Ambient Gold Halo Glow matching the video's metallic sheen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-[1] transform-gpu" />

      {/* 3. Main Overlaid Content (Centered & Prominent) */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/35 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-medium shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-wide">Next-Gen Contactless Executive Identity</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
        >
          The Smart NFC Card <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            Engineered for Leaders.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        >
          Tap against any modern iPhone or Android to beam your verified executive
          credentials, services, and 1-click downloadable vCard. No app required.
          Track tap telemetry, capture leads, and update cloud data anytime.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 text-sm sm:text-base font-bold flex items-center justify-center gap-2 group transition-all shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)]"
            >
              <span>Order Physical Smart Card</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/register?plan=free"
              className="w-full sm:w-auto px-7 py-4 rounded-full border border-white/20 hover:border-amber-400/60 bg-black/50 hover:bg-black/75 backdrop-blur-xl text-sm sm:text-base text-white font-medium flex items-center justify-center gap-2 transition-all shadow-xl"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Create Free Digital Profile</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Micro Trust Proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-slate-300 font-medium"
        >
          <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero App Needed for Recipients</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Genuine NTAG213 Microchip</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Ongoing Subscription Required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
