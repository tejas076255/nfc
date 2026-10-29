"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Does the recipient need to download an app to receive my contact details?",
    answer: "No. Absolutely zero apps or account creation are required for the recipient. When you tap your TapSync card against an iPhone or Android phone, native NFC background tag reading immediately triggers a notification banner that opens your full digital profile and initiates the 1-tap contact save prompt.",
  },
  {
    question: "Which smartphones are compatible with TapSync NFC cards?",
    answer: "Every iPhone produced since 2018 (iPhone XS, XR, 11, 12, 13, 14, 15, 16, and newer) has native NFC background reading always enabled. Nearly all modern Android devices from Samsung, Google Pixel, OnePlus, and Xiaomi also feature active NFC transceivers out of the box.",
  },
  {
    question: "What happens if someone has an older phone without NFC enabled?",
    answer: "Every TapSync card features a high-contrast dynamic QR code micro-etched on the back. Any smartphone with a standard camera app can scan the QR code to instantly load your identical digital profile with the exact same 1-tap vCard download capabilities.",
  },
  {
    question: "Can I update my phone number, title, or company after receiving the card?",
    answer: "Yes, infinitely and instantaneously. Your TapSync physical card points to your secure dynamic cloud profile. Whenever you edit your phone, email, calendar link, or portfolio in your dashboard, the changes reflect immediately on the very next tap—with no card reprogramming or reprint required.",
  },
  {
    question: "What if I lose my physical card? Can someone steal my identity?",
    answer: "You have complete control. From your dashboard, you can toggle the 'Remote Kill Switch / Card Freeze' at any second. This instantly deactivates the physical card redirect, displaying a secure disabled notice or redirecting to a custom emergency page until you recover or replace the card.",
  },
  {
    question: "Is there any mandatory monthly fee or subscription to keep my card working?",
    answer: "No. Unlike other smart card providers that charge ₹400-800/month just to keep your profile active, TapSync provides free lifetime cloud profile hosting with every hardware purchase. You only pay for optional enterprise team management features if you manage multiple team members.",
  },
  {
    question: "Does the physical card require batteries or charging?",
    answer: "Never. TapSync cards use passive NFC transponders powered entirely by the magnetic field emitted by the reading smartphone during the fraction of a second they make contact. There are no batteries, no internal circuits that degrade, and zero charging required.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#030508] overflow-hidden">
      {/* Background radial glow */}
      <motion.div 
        className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-300 text-xs font-medium uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
            Everything you need <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              to know about TapSync
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Have questions before switching? Here is how our hardware, dynamic redirect engine, and security protocols work.
          </p>
        </motion.div>

        {/* Accordion List with AnimatePresence */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-amber-500/30 bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-lg shadow-amber-500/5"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base sm:text-lg font-medium transition-colors ${
                    isOpen ? "text-amber-300" : "text-white"
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                      isOpen 
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300" 
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/[0.04] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Support Helpdesk */}
        <motion.div 
          className="mt-14 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-center flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Still have questions?</h4>
              <p className="text-slate-400 text-xs">Our engineering team is available 24/7 on live chat and WhatsApp.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="py-2.5 px-5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 inline-block"
            >
              Chat With Support
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
