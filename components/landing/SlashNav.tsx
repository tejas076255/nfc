"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Wifi,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Layers,
  ShieldCheck,
  Zap,
  BarChart3,
  CreditCard,
  Lock,
} from "lucide-react";

interface SlashNavProps {
  sessionUser?: {
    id?: string;
    email?: string;
  } | null;
}

export function SlashNav({ sessionUser }: SlashNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [hardwareOpen, setHardwareOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Dynamic Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 origin-left z-50 shadow-[0_0_12px_rgba(245,158,11,0.9)] pointer-events-none"
        style={{ scaleX }}
      />

      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#030508]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3"
            : "bg-transparent py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.08 }} 
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"
            >
              <Wifi className="w-4 h-4 text-slate-950 rotate-90 stroke-[2.5]" />
            </motion.div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
                TapSync
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            {/* Platform Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 transition-colors ${
                  platformOpen ? "text-white" : "hover:text-white"
                }`}
                type="button"
              >
                <span>Platform</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    platformOpen ? "rotate-180 text-amber-400" : "text-slate-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {platformOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full -left-6 w-80 pt-2 z-50"
                  >
                    <div className="p-3.5 rounded-2xl bg-[#080c16]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                      <a
                        href="#features"
                        onClick={() => setPlatformOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 group-hover/item:bg-amber-500/20 transition-colors">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-amber-400 transition-colors">
                            Instant vCard Engine
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            Beam full address book info to iPhone/Android in 0.4s
                          </div>
                        </div>
                      </a>

                      <a
                        href="#features"
                        onClick={() => setPlatformOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5 group-hover/item:bg-blue-500/20 transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-blue-400 transition-colors">
                            Scan & Tap Telemetry
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            Real-time analytics comparing NFC taps vs QR scans
                          </div>
                        </div>
                      </a>

                      <a
                        href="#features"
                        onClick={() => setPlatformOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 group-hover/item:bg-purple-500/20 transition-colors">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-purple-400 transition-colors">
                            Dynamic Multi-Profile
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            Route 1 physical card to multiple role identities
                          </div>
                        </div>
                      </a>

                      <a
                        href="#features"
                        onClick={() => setPlatformOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 group-hover/item:bg-emerald-500/20 transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-emerald-400 transition-colors">
                            Remote Fleet Lock
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            Instant freeze lock switch for lost or reassigned cards
                          </div>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hardware Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHardwareOpen(true)}
              onMouseLeave={() => setHardwareOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 transition-colors ${
                  hardwareOpen ? "text-white" : "hover:text-white"
                }`}
                type="button"
              >
                <span>Hardware</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    hardwareOpen ? "rotate-180 text-amber-400" : "text-slate-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {hardwareOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full -left-6 w-72 pt-2 z-50"
                  >
                    <div className="p-3.5 rounded-2xl bg-[#080c16]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                      <a
                        href="#hardware"
                        onClick={() => setHardwareOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 group-hover/item:bg-amber-500/20 transition-colors">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-amber-400 transition-colors">
                            Velvet Matte PVC (₹999)
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            Flagship soft-touch finish with NXP NTAG216 chip
                          </div>
                        </div>
                      </a>

                      <a
                        href="#hardware"
                        onClick={() => setHardwareOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className="p-2 rounded-lg bg-slate-500/10 text-slate-300 mt-0.5 group-hover/item:bg-slate-500/20 transition-colors">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover/item:text-slate-200 transition-colors">
                            Gloss Core PVC (₹499)
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            High-density 0.76mm composite with NTAG213
                          </div>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Section Links */}
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#compare" className="hover:text-white transition-colors">
              Why Switch
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {sessionUser ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-white/20 inline-flex items-center gap-1.5"
                  >
                    <span>Get TapSync</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-b border-white/10 bg-[#060a12]/98 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-3 text-sm">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  Platform & vCard
                </a>
                <a
                  href="#hardware"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  Hardware Specs
                </a>
                <a
                  href="#templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  Persona Templates
                </a>
                <a
                  href="#compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  Paper vs NFC
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  Hardware Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-300 hover:text-white"
                >
                  FAQ
                </a>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  {sessionUser ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-center text-xs uppercase tracking-wider"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 rounded-full border border-white/20 text-white font-medium text-center text-xs"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 rounded-full bg-white text-slate-950 font-bold text-center text-xs uppercase tracking-wider"
                      >
                        Order Smart Card
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
