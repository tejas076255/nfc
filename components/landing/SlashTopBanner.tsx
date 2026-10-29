"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function SlashTopBanner() {
  return (
    <div className="relative z-50 bg-[#060913]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-2 text-xs text-slate-300 overflow-hidden">
      {/* Background ambient sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.04] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold tracking-wider uppercase">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>TapSync 2.0</span>
        </div>

        <span className="font-normal text-slate-200 text-xs sm:text-[13px] tracking-tight">
          Next-Gen Velvet Matte Metallic NFC Cards & Instant 0.4s Phonebook Sync are now live.
        </span>

        <span className="hidden sm:inline-block h-3 w-px bg-white/20" aria-hidden="true" />

        <Link
          href="/register"
          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs sm:text-[13px] font-medium transition-colors group"
        >
          <span>Claim Free Digital Profile</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
