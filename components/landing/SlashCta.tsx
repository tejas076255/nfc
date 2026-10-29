"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Wifi } from "lucide-react";

export function SlashCta() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#030508] overflow-hidden">
      {/* Background radial spotlight with breathing animation */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-600/15 rounded-full blur-[160px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Main Banner Box with Scroll Reveal */}
        <motion.div 
          className="relative rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.05] via-[#060a12]/90 to-[#020408] p-8 sm:p-14 lg:p-16 text-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] group"
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          
          {/* Specular hairline top glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          
          {/* Background subtle micro-grid */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-8"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Elevate Your Professional First Impression</span>
          </motion.div>

          {/* Large Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto mb-6 leading-[1.15]">
            Stop handing out paper that gets <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              thrown into the trash
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            One tap instantly transfers your authenticated contact card, dynamic social links, and live calendar directly into any client&apos;s smartphone.
          </p>

          {/* CTA Button Group with Magnetic Spring Motion */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register?tier=luxe"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-[#030508] font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.45)]"
              >
                <span>Order Velvet Matte (₹999)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register?plan=free"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-300 hover:border-white/40"
              >
                <span>Create Free Digital Profile</span>
                <Wifi className="w-4 h-4 text-amber-400 rotate-90" />
              </Link>
            </motion.div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400 border-t border-white/[0.08] pt-8">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Ships Within 24 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free Delivery Across India</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Lifetime Profile Hosting Included</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
