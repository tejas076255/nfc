"use client";

import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  Wallet, 
  Award, 
  Building, 
  Zap, 
  Layers 
} from "lucide-react";

interface PartnerBadge {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: PartnerBadge[] = [
  { name: "Apple Wallet Certified", category: "Digital Passes", icon: Wallet },
  { name: "Google Wallet Ready", category: "NFC Ecosystem", icon: Smartphone },
  { name: "NXP Semiconductors", category: "NTAG216 Chipset", icon: Cpu },
  { name: "ISO/IEC 14443-A", category: "Security Standard", icon: ShieldCheck },
  { name: "YC Founders Club", category: "Venture Alumni", icon: Award },
  { name: "TechSparks 2026", category: "Enterprise Partner", icon: Zap },
  { name: "Sotheby's Prime", category: "Brokerage Fleet", icon: Building },
  { name: "Sequoia Scouts", category: "Angel Syndicate", icon: Layers },
];

export function SlashLogoCloud() {
  return (
    <section className="relative py-16 border-y border-white/[0.06] bg-[#020407] overflow-hidden">
      {/* Edge gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#020407] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#020407] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate-500 font-medium">
          Trusted by founders, executives, and enterprise teams at over 500+ modern organizations
        </p>
      </div>

      {/* Infinite scrolling marquee wrapper */}
      <div className="flex overflow-hidden select-none group">
        <div className="flex items-center gap-10 sm:gap-14 animate-marquee group-hover:[animation-play-state:paused] shrink-0">
          {PARTNERS.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={`badge-1-${idx}`}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-200 shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-amber-400/80">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 tracking-wide">{partner.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{partner.category}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Duplicate track for seamless infinite scroll */}
        <div className="flex items-center gap-10 sm:gap-14 animate-marquee group-hover:[animation-play-state:paused] shrink-0" aria-hidden="true">
          {PARTNERS.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={`badge-2-${idx}`}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-200 shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-amber-400/80">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 tracking-wide">{partner.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{partner.category}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
