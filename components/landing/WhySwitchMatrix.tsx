"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Zap, TrendingUp, ShieldAlert } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  paper: string | boolean;
  qr: string | boolean;
  tapsync: string | boolean;
  highlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: "Contact Transfer Speed",
    paper: "Manual typing (~90s)",
    qr: "Requires camera app (~15s)",
    tapsync: "Instant sub-100ms NFC Tap",
    highlight: true,
  },
  {
    dimension: "Real-time Profile Updates",
    paper: false,
    qr: "Limited or requires reprint",
    tapsync: "Instant cloud update anytime",
    highlight: false,
  },
  {
    dimension: "Executive Tactile Prestige",
    paper: "Disposable paper stock",
    qr: "Impersonal screen scan",
    tapsync: "0.76mm Velvet Matte Luxury Card",
    highlight: true,
  },
  {
    dimension: "1-Click Direct Calendar Booking",
    paper: false,
    qr: "Separate link",
    tapsync: "Built-in Cal.com / Calendly sync",
    highlight: false,
  },
  {
    dimension: "Tap & Scan Analytics Telemetry",
    paper: false,
    qr: "Basic scan counter",
    tapsync: "Live geo-location & device telemetry",
    highlight: true,
  },
  {
    dimension: "Remote Kill Switch / Freeze Card",
    paper: false,
    qr: false,
    tapsync: "Instant 1-click cloud lock",
    highlight: false,
  },
  {
    dimension: "Environmental Waste",
    paper: "500+ cards in landfill/year",
    qr: "Digital only",
    tapsync: "Zero waste permanent card",
    highlight: false,
  },
  {
    dimension: "5-Year Total Cost",
    paper: "₹12,000+ (reprints & updates)",
    qr: "Free with ads or ₹2,400/yr",
    tapsync: "₹499 - ₹999 One-time hardware",
    highlight: true,
  },
];

export function WhySwitchMatrix() {
  return (
    <section id="compare" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#030508] overflow-hidden">
      {/* Background ambient lighting */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-medium uppercase tracking-widest mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>The Modern Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Why 12,000+ executives have <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              abandoned paper forever
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            88% of paper business cards are thrown away in under 7 days. TapSync ensures your details land directly in your client&apos;s address book with zero friction.
          </p>
        </motion.div>

        {/* Comparison Matrix Table with Scroll Reveal */}
        <motion.div 
          className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-[#05070c] overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="py-5 px-6 text-sm font-semibold text-slate-300 w-2/5">Capability</th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-medium text-slate-400 w-1/5 text-center">Paper Cards</th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-medium text-slate-400 w-1/5 text-center">Generic QR Apps</th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-bold text-amber-400 w-1/5 text-center bg-amber-500/10 border-x border-amber-500/20">
                    TapSync NFC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr 
                    key={idx}
                    className={`transition-colors hover:bg-white/[0.04] ${row.highlight ? "bg-white/[0.01]" : ""}`}
                  >
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                      {row.highlight && <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span>{row.dimension}</span>
                    </td>

                    {/* Paper Column */}
                    <td className="py-4 px-6 text-center text-slate-400">
                      {typeof row.paper === "boolean" ? (
                        row.paper ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-rose-500/70 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-400">{row.paper}</span>
                      )}
                    </td>

                    {/* QR Column */}
                    <td className="py-4 px-6 text-center text-slate-400">
                      {typeof row.qr === "boolean" ? (
                        row.qr ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-rose-500/70 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-400">{row.qr}</span>
                      )}
                    </td>

                    {/* TapSync Column */}
                    <td className="py-4 px-6 text-center font-semibold text-amber-300 bg-amber-500/[0.06] border-x border-amber-500/20">
                      {typeof row.tapsync === "boolean" ? (
                        row.tapsync ? (
                          <Check className="w-5 h-5 text-amber-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-bold text-amber-300">{row.tapsync}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action Callout */}
          <div className="p-6 sm:p-8 bg-black/40 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-300">
                Stop wasting ₹2,000 every quarter reprinting business cards whenever a phone number or title changes.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-slate-200 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-white/20 shrink-0"
              >
                <span>Upgrade To TapSync</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
