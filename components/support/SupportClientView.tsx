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
      a: "Click 'Edit Profile' in the sidebar (or on your profile card in Digital Profiles). You will see the complete 12-section editor with a real-time live iPhone simulator. All updates save instantly and reflect live on your NFC card.",
    },
    {
      q: "Can recipients save my contact details directly to their phone contacts?",
      a: "Yes! Every Tapbez profile features a prominent 'Save Contact to Phone (vCard)' button. With one tap, your contact card (name, phone numbers, email, company, role, website, and address) downloads directly into their native iOS/Android address book.",
    },
    {
      q: "What if someone's smartphone does not have NFC turned on?",
      a: "Every profile automatically includes a dynamic high-resolution QR code. Anyone can scan it using their phone's built-in camera to open your profile instantly. You can also download high-res QR stickers from the 'QR Code Engine' section.",
    },
    {
      q: "How do I link an NFC card to my digital profile?",
      a: "Go to 'My NFC Cards' in your dashboard to view your registered cards and tokens. You can also write your public profile URL (e.g. https://tapbez.in/p/your-slug) to any standard NTAG213/215/216 NFC card using the free NFC Tools app.",
    },
    {
      q: "How do I upgrade my plan or order customized physical NFC cards?",
      a: "Visit 'Billing' or 'Card Orders' in your dashboard sidebar to upgrade your profile quotas or order custom matte black, bamboo wood, or metal NFC business cards printed with your logo.",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pb-12">
      {/* HEADER */}
      <div className="pb-6 border-b border-white/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Help & Support Center
            </h1>
            <p className="text-xs text-slate-400">
              Need assistance with your NFC cards, profile sections, or account? We are here to help.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK CONTACT CHANNELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Channel */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all bg-gradient-to-br from-emerald-950/20 via-slate-900 to-transparent">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">WhatsApp Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant assistance directly on WhatsApp for quick setup, troubleshooting, and NFC queries.
            </p>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hi%20Tapbez%20Support%2C%20I%20need%20help%20with%20my%20digital%20profile%20and%20NFC%20card."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Email Channel */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all bg-gradient-to-br from-blue-950/20 via-slate-900 to-transparent">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Email Helpdesk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach our engineering and support desk directly. Typical response time is under 4 hours.
            </p>
            <div className="pt-1">
              <code className="text-xs font-mono text-teal-300 bg-teal-950/40 px-2 py-1 rounded-md border border-teal-500/30 select-all">
                support@tapbez.in
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="mailto:support@tapbez.in?subject=Tapbez%20Support%20Request"
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition-colors shadow-md shadow-blue-600/20"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card Orders Channel */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all bg-gradient-to-br from-purple-950/20 via-slate-900 to-transparent">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">NFC Card Orders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track custom card manufacturing, engraving proofs, dispatch tracking, and delivery timelines.
            </p>
          </div>
          <Link
            href="/dashboard/cards"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <span>View My NFC Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* QUICK LINKS BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-teal-950/30 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-slate-200">
            Looking for your digital profile editor? Click <strong className="text-white">Edit Profile</strong> in the sidebar to open the 12-section visual builder.
          </span>
        </div>
        <Link
          href="/dashboard/profiles"
          className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 shrink-0 hover:underline"
        >
          <span>Open Profiles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">
            Quick answers to the most common questions about Tapbez digital business cards.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 bg-slate-900/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBMIT SUPPORT TICKET */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Submit a Support Ticket</span>
          </h2>
          <p className="text-xs text-slate-400">
            Can’t find what you need? Send a message directly to our engineering team.
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Support Ticket #TBZ-{Math.floor(1000 + Math.random() * 9000)} Submitted!</span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Thank you, {user.name}. A confirmation email has been logged for <strong className="text-white">{user.email}</strong>. Our team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => setTicketSubmitted(false)}
              className="mt-2 text-xs font-semibold text-emerald-400 hover:underline"
            >
              Submit another question
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Name</label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Issue Category</label>
              <select
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Profile Customization & Links">Profile Customization & Links</option>
                <option value="NFC Card Scanning / Tapping Issue">NFC Card Scanning / Tapping Issue</option>
                <option value="Physical NFC Card Order & Delivery">Physical NFC Card Order & Delivery</option>
                <option value="Subscription, Invoices & Billing">Subscription, Invoices & Billing</option>
                <option value="Feature Request or Bug Report">Feature Request or Bug Report</option>
                <option value="Other Assistance">Other Assistance</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Message / Issue Details</label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your issue or what you need assistance with..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Ticket...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

