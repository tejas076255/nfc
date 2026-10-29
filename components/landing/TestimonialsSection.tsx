"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  highlightMetric: string;
  hardwareOwned: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Vikramaditya Singhania",
    role: "Managing Partner",
    company: "Vanguard Angel Syndicate",
    quote: "At private investor dinners, fumbling with paper cards feels like 2012. Tapping my Velvet Matte card to an LP's iPhone instantly opens my portfolio overview and Cal.com link. It immediately sets a tone of modern authority.",
    highlightMetric: "42 meetings booked directly from taps",
    hardwareOwned: "Velvet Matte • Obsidian Noir",
    initials: "VS",
    accent: "#f59e0b",
  },
  {
    name: "Natasha Kulkarni",
    role: "VP of Enterprise Partnerships",
    company: "CloudScale Infra",
    quote: "We deployed 60 TapSync cards for our enterprise sales reps at SaaStr. When a prospect taps, their contact info saves directly and triggers our CRM workflow. Our lead capture rate doubled compared to our old paper days.",
    highlightMetric: "+148% lead capture conversion",
    hardwareOwned: "Enterprise Fleet Edition",
    initials: "NK",
    accent: "#3b82f6",
  },
  {
    name: "Arjun Bhasin",
    role: "Principal Architect & Founder",
    company: "Studio Forma Mumbai",
    quote: "Clients are visibly impressed every time I tap the card to their phone. The soft-touch velvet finish has the exact weight and texture of a premium Black Card. It's the most effective ₹999 business investment I've ever made.",
    highlightMetric: "Zero reprints in 14 months",
    hardwareOwned: "Velvet Matte • Emerald Velvet",
    initials: "AB",
    accent: "#10b981",
  },
];

export function TestimonialsSection() {
  return (
    <section id="reviews" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#030508] overflow-hidden">
      {/* Background ambient lighting */}
      <motion.div 
        className="absolute top-1/2 right-1/4 w-[600px] h-[350px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-300 text-xs font-medium uppercase tracking-widest mb-4">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Proof</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Trusted by over <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              12,000+ top performers
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            See how founders, executives, real estate brokers, and enterprise sales teams are replacing paper cards with TapSync.
          </p>
        </motion.div>

        {/* Testimonials 3-Column Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-[#04060a] p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-2">5.0 Verified</span>
                </div>

                {/* Highlight Metric Badge */}
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono mb-5">
                  {t.highlightMetric}
                </div>

                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed italic mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author & Hardware Metadata */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner border border-white/20"
                    style={{ backgroundColor: `${t.accent}30` }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm leading-tight flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>

              {/* Hardware Model Footnote */}
              <div className="mt-4 pt-2 border-t border-white/[0.04] text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Verified Hardware</span>
                <span className="text-slate-300">{t.hardwareOwned}</span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
