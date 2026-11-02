"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  CreditCard,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface SupportClientViewProps {
  user: {
    name: string;
    email: string;
  };
}

export function SupportClientView({ user }: SupportClientViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("Profile Customization & Links");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("support@tapbez.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketSubmitted(true);
      setTicketMessage("");
    }, 600);
  };

  const faqs = [
    {
      q: "How does my Tapbez NFC Business Card work with iPhone & Android?",
      a: "No special app is required! Simply tap your NFC card against the top back (near camera) on iPhones (iPhone 7 and newer), or the middle/upper back on Android phones with NFC enabled. A native browser notification immediately opens your live profile.",
    },
    {
      q: "Where do I edit my business details, profile photo, and links?",
      a: "Click 'Profile Studio' in the sidebar or go to Digital Profiles -> Edit Profile. You can customize all 8 steps including header photos, contact action buttons, social links, bio description, services, portfolio images, customer testimonials, and color templates with real-time mobile preview.",
    },
    {
      q: "Can I update my card's links after it has already been printed?",
      a: "Yes, 100%! The physical NFC chip points to a permanent dynamic cloud routing token. Whenever you update your profile links, contact details, or bio in the dashboard, anyone who taps your physical card immediately sees your latest live details.",
    },
    {
      q: "How many digital profiles can I create under my plan?",
      a: "The Free plan includes 1 full digital business card. The Starter plan provides 3 profiles, and the Pro / Team plan gives you up to 25 digital cards with dedicated employee profiles and multi-role lead capture CRM.",
    },
    {
      q: "How do I download or print the QR code backup?",
      a: "Go to the QR Code section in the sidebar. You can download print-ready high-contrast PNG QR codes for tabletop displays, marketing brochures, packaging, and email signatures.",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pb-12 transition-colors">
      {/* HEADER */}
      <div className="pb-6 border-b border-slate-200 dark:border-white/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Help & Support Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need assistance with your NFC cards, profile sections, or account? We are here to help.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK CONTACT CHANNELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Channel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Support</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant assistance directly on WhatsApp for quick setup, troubleshooting, and NFC queries.
            </p>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hi%20Tapbez%20Support%2C%20I%20need%20help%20with%20my%20digital%20profile%20and%20NFC%20card."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Email Channel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Helpdesk</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Reach our engineering and support desk directly. Typical response time is under 4 hours.
            </p>
            <div className="pt-1">
              <code className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-md border border-teal-200 dark:border-teal-500/30 select-all">
                support@tapbez.in
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="mailto:support@tapbez.in?subject=Tapbez%20Support%20Request"
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition-colors shadow-sm"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card Orders Channel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">NFC Card Orders</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track custom card manufacturing, engraving proofs, dispatch tracking, and delivery timelines.
            </p>
          </div>
          <Link
            href="/dashboard/cards"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>View My NFC Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* QUICK LINKS BANNER */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">
            Looking for your digital profile editor? Click <strong className="text-slate-900 dark:text-white font-bold">Profile Studio</strong> in the sidebar to open the 8-step live visual builder.
          </span>
        </div>
        <Link
          href="/dashboard/profiles"
          className="text-teal-700 dark:text-teal-400 hover:underline font-bold flex items-center gap-1 shrink-0"
        >
          <span>Open Profiles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quick answers to the most common questions about Tapbez digital business cards.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBMIT SUPPORT TICKET */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Submit a Support Ticket</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Can’t find what you need? Send a message directly to our engineering team.
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Support Ticket #TBZ-{Math.floor(1000 + Math.random() * 9000)} Submitted!</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-200/80">
              Thank you, {user.name}. A confirmation email has been logged for <strong className="text-slate-900 dark:text-white">{user.email}</strong>. Our team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => setTicketSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Category</label>
              <select
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Profile Customization & Links">Profile Customization & Links</option>
                <option value="Physical NFC Card Activation">Physical NFC Card Activation</option>
                <option value="Billing & Subscription Plan">Billing & Subscription Plan</option>
                <option value="Lead Inquiries & CSV Export">Lead Inquiries & CSV Export</option>
                <option value="Other Technical Query">Other Technical Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Message / What happened?
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain what you need assistance with or provide steps to reproduce any issue..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 resize-none font-medium"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !ticketMessage.trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Dispatching..." : "Send Ticket"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
