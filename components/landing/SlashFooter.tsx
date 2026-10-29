"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wifi, ArrowRight, CheckCircle2, Shield } from "lucide-react";

export function SlashFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#020305] border-t border-white/[0.08] text-slate-400 text-xs sm:text-sm overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        
        {/* Top Tier: Brand, Status, and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Wifi className="w-4 h-4 text-black rotate-90" />
              </div>
              <span className="font-semibold text-lg text-white">TapSync</span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              The next-generation smart business card. Replace disposable paper with precision NXP NFC transponders, dynamic cloud profiles, and instant contact downloads.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">TapSync Cloud Engine:</span>
              <span className="text-emerald-400 font-semibold">Operational (99.99%)</span>
            </div>
          </div>

          {/* Newsletter / Hardware Drops Col */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
              <h3 className="text-white font-semibold text-base mb-2">Subscribe for Hardware Drops & Feature Releases</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-5">
                Get early access to limited edition metallic finishes, NFC firmware updates, and sales networking playbooks.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are subscribed. We never spam.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your corporate email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-semibold text-xs tracking-wider uppercase transition-all shrink-0 inline-flex items-center justify-center gap-2"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Middle Tier: Multi-column sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-white/[0.08]">
          
          {/* Col 1: Hardware */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">Hardware</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="#hardware" className="hover:text-white transition-colors">Velvet Matte PVC (₹999)</Link>
              </li>
              <li>
                <Link href="#hardware" className="hover:text-white transition-colors">Gloss Core PVC (₹499)</Link>
              </li>
              <li>
                <Link href="#hardware" className="hover:text-white transition-colors">Industrial Titanium Edition</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Custom Foil Stamp Studio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Bulk Team Fleet Orders</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">Platform</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">Instant vCard Download Engine</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">Dynamic Profile Switcher</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">Tap & Scan Live Telemetry</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">Remote Kill Switch / Card Lock</Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-white transition-colors">Curated Industry Blueprints</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">Integrations</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <span className="text-slate-300">Apple Wallet Pass</span>
              </li>
              <li>
                <span className="text-slate-300">Google Wallet Card</span>
              </li>
              <li>
                <span className="text-slate-300">Cal.com & Calendly</span>
              </li>
              <li>
                <span className="text-slate-300">Salesforce & HubSpot CRM</span>
              </li>
              <li>
                <span className="text-slate-300">WhatsApp 1-Tap Connect</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Company */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">Company & Trust</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Member Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Create Free Account</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Enterprise Concierge</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Tier: Copyright & Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} TapSync Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO/IEC 14443-A Authenticated</span>
            <span>NXP NTAG Certified</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
