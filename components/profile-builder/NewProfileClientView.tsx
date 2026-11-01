"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import { IndustryType } from "@/lib/profiles/types";
import {
  Sliders,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  ArrowLeft,
  AlertCircle,
  Clock,
  Smartphone,
  Phone,
  Mail,
  MessageSquare,
  Download,
  Briefcase,
  Layers,
  Palette,
  ShieldCheck,
  Check,
  Sun,
  Moon,
  Info,
} from "lucide-react";

interface NewProfileClientViewProps {
  totalProfiles: number;
  profileLimit: number;
  planName: string;
  isLimitReached: boolean;
}

// Sample preview details for each template to display in live phone mockup
const TEMPLATE_PREVIEW_META: Record<
  IndustryType,
  {
    sampleName: string;
    sampleTitle: string;
    sampleCompany: string;
    sampleBio: string;
    sampleServices: { title: string; price: string }[];
    avatarUrl: string;
    badgeText: string;
  }
> = {
  professional: {
    sampleName: "Siddharth Mehta",
    sampleTitle: "Senior Corporate Counsel",
    sampleCompany: "Vertex Legal Advisory",
    sampleBio: "14+ years advising high-growth tech firms through regulatory strategy, M&A and corporate scaling.",
    sampleServices: [
      { title: "Corporate Advisory", price: "₹25,000" },
      { title: "Contract Review", price: "₹15,000" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    badgeText: "Verified Legal Counsel",
  },
  beauty: {
    sampleName: "Ananya Sen",
    sampleTitle: "Celebrity Bridal & Editorial Artist",
    sampleCompany: "Luxe Atelier Beauty",
    sampleBio: "Crafting bespoke bridal looks, luxury masterclasses, and editorial aesthetics for marquee clients across India.",
    sampleServices: [
      { title: "Bridal Signature Styling", price: "₹45,000" },
      { title: "Editorial Makeup", price: "₹20,000" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    badgeText: "Master Stylist",
  },
  real_estate: {
    sampleName: "Kabir Oberoi",
    sampleTitle: "Principal Partner — Luxury Estates",
    sampleCompany: "Prime Horizon Realty",
    sampleBio: "Representing prime commercial assets and high-value residential developments in Bandra & South Mumbai.",
    sampleServices: [
      { title: "Private Property Tour", price: "Complimentary" },
      { title: "Portfolio Advisory", price: "Custom" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    badgeText: "RERA Certified Broker",
  },
  creative: {
    sampleName: "Maya Lin",
    sampleTitle: "Design Director & Brand Strategist",
    sampleCompany: "Studio Neo Visuals",
    sampleBio: "Brand identity systems, high-converting digital design, and aesthetic typography for future-forward ventures.",
    sampleServices: [
      { title: "Brand Identity Design", price: "₹60,000" },
      { title: "Design Sprint (1 Week)", price: "₹35,000" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    badgeText: "Design Lead",
  },
  local_business: {
    sampleName: "The Artisan Roast & Brew",
    sampleTitle: "Specialty Coffee & European Bakery",
    sampleCompany: "Artisan Brew Co.",
    sampleBio: "Handcrafted single-origin coffees, fresh daily croissants, and warm artisanal cafe vibes open 7 days a week.",
    sampleServices: [
      { title: "Signature Tasting Menu", price: "₹499" },
      { title: "Event Bean Catering", price: "₹4,999" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80",
    badgeText: "Local Favorite",
  },
  creator: {
    sampleName: "Aryan Sharma",
    sampleTitle: "Tech Creator & Podcast Host",
    sampleCompany: "Pulse Digital Media",
    sampleBio: "Demystifying AI, gadgets, and digital productivity for 250K+ weekly subscribers and technology enthusiasts.",
    sampleServices: [
      { title: "Sponsorship Feature", price: "₹40,000" },
      { title: "Creator Mentorship (1:1)", price: "₹5,000" },
    ],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    badgeText: "Verified Creator",
  },
};

export function NewProfileClientView({
  totalProfiles,
  profileLimit,
  planName,
  isLimitReached: initialLimitReached,
}: NewProfileClientViewProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<IndustryType>("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaReached, setIsQuotaReached] = useState(initialLimitReached);
  const [previewThemeMode, setPreviewThemeMode] = useState<"dark" | "light">("dark");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const selectedTemplate = INDUSTRY_TEMPLATES[industry] || INDUSTRY_TEMPLATES.professional;
  const previewMeta = TEMPLATE_PREVIEW_META[industry] || TEMPLATE_PREVIEW_META.professional;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), industry }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        if (data.code === "PLAN_LIMIT_REACHED" || res.status === 403) {
          setIsQuotaReached(true);
          throw new Error(data.error || "Profile limit reached for your current plan.");
        }
        throw new Error(data.error || "Failed to create profile");
      }

      router.push(`/dashboard/profiles/${data.id}/edit`);
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      setLoading(false);
    }
  };

  // If user has reached their plan limit
  if (isQuotaReached) {
    return (
      <div className="p-6 sm:p-10 max-w-3xl mx-auto w-full space-y-8 animate-in fade-in">
        {/* Breadcrumb / Back */}
        <Link
          href="/dashboard/profiles"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Digital Profiles</span>
        </Link>

        {/* Limit Reached Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-950/20 via-slate-900 to-indigo-950/30 border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Plan Quota Full
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Profile Limit Reached ({totalProfiles} of {profileLimit} Used)
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your current <strong className="text-white">{planName}</strong> plan allows creating up to{" "}
            <strong className="text-white">{profileLimit}</strong> digital business card profile(s). To create and deploy additional profiles for yourself or your team members, upgrade your plan or delete unused profiles.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href="/dashboard/billing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade Plan in Billing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/profiles"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold text-center border border-white/10 transition-colors"
            >
              View Existing Profiles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard/profiles"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Digital Profiles</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Create New Digital Profile</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Preview and select an industry template. You can customize every section, theme, and vCard later in the editor.
          </p>
        </div>

        {/* Quota Tracker Badge */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/30 text-xs self-start sm:self-auto shrink-0 shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Quota Utilization
          </div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">Card #{totalProfiles + 1}</span>
            <span className="text-slate-400">of</span>
            <span>{profileLimit >= 999 ? "Unlimited" : profileLimit} Slots</span>
          </div>
        </div>
      </div>

      {/* WORKFLOW ROADMAP (Overview Step-by-Step Banner) */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
            1
          </div>
          <div>
            <div className="font-bold text-blue-950 dark:text-blue-200">
              Step 1 of 3: Choose Template Overview & Set Name
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
              Select your base design below. In Step 2, you&apos;ll customize contact buttons, services, portfolio, and publish your card.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/50 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fully Editable Later</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT = CONFIGURATION, RIGHT = LIVE PHONE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN (7 Cols): Inputs, Template Family, Feature List     */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cardholder / Business Name */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Cardholder / Business Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siddharth Mehta or Vertex Advisory"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This name appears on the card header, in the live preview on the right, and inside the NFC tap payload.
              </p>
            </div>

            {/* Template Family Selection Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
                  Select Industry Template Family
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click any template to preview
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => {
                  const isSelected = industry === tmpl.industry;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setIndustry(tmpl.industry)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-600/10 shadow-md shadow-blue-500/10 dark:border-blue-500"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {tmpl.industry.replace("_", " ")}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                            style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                            title={`Accent color: ${tmpl.defaultTheme.accentColor}`}
                          />
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {tmpl.name}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                            {tmpl.tagline}
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/10 mt-3 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {tmpl.defaultBlocks.length} Default Sections
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                            Preview →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAILED TEMPLATE OVERVIEW & INCLUDED SECTIONS */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: selectedTemplate.defaultTheme.accentColor }}
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedTemplate.name} — Included Overview
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pre-packaged sections ready to customize
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {selectedTemplate.defaultTheme.accentColor}
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Identity Header, Avatar & Cover Photo</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Direct Actions (Call, WhatsApp, Email)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>vCard Instant Contact Exchange</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>About Story & Key Credentials</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Service Offerings & Pricing Catalog</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Instant Lead Capture & Inquiry Form</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  After clicking <strong>Create & Configure Sections</strong>, you&apos;ll be taken to the 8-step Profile Studio where you can edit photos, add your phone/WhatsApp, upload files, and reorder blocks.
                </span>
              </div>
            </div>

            {/* Mobile Preview Toggle Button (Visible only on mobile/tablet) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10"
              >
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>{showMobilePreview ? "Hide Live Phone Preview" : "📱 View Live Template Preview"}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/10">
              <Link
                href="/dashboard/profiles"
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create & Configure Sections</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN (5 Cols): Live Interactive Mobile Phone Mockup    */}
        {/* ============================================================== */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-6 space-y-3 ${
            showMobilePreview ? "block" : "hidden lg:block"
          }`}
        >
          {/* Header Controls for Live Preview */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span>Live Template Preview</span>
            </div>

            {/* Light / Dark Mode Mockup Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPreviewThemeMode("light")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  previewThemeMode === "light"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewThemeMode("dark")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  previewThemeMode === "dark"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* PHONE FRAME */}
          <div className="w-full max-w-[340px] mx-auto rounded-[36px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10">
            {/* Top Phone Notch / Speaker */}
            <div className="relative pt-1 pb-2 flex items-center justify-between px-4 text-[10px] text-slate-400 font-medium">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-4 h-2 border border-slate-400 rounded-xs" />
              </div>
            </div>

            {/* PHONE SCREEN CONTENT */}
            <div
              className={`rounded-[26px] overflow-hidden transition-colors duration-300 max-h-[580px] overflow-y-auto no-scrollbar space-y-4 pb-6 ${
                previewThemeMode === "dark"
                  ? "bg-[#0a0f1d] text-white"
                  : "bg-white text-slate-900"
              }`}
            >
              {/* Header Cover & Avatar */}
              <div className="relative">
                <div
                  className="h-24 w-full bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(135deg, ${selectedTemplate.defaultTheme.accentColor}40, #0f172a)`,
                  }}
                />
                <div className="px-4 -mt-10 flex items-end justify-between">
                  <div className="relative">
                    <img
                      src={previewMeta.avatarUrl}
                      alt={name || previewMeta.sampleName}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-950 shadow-lg"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center text-white text-[9px]"
                      style={{ backgroundColor: selectedTemplate.defaultTheme.accentColor }}
                    >
                      ✓
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: `${selectedTemplate.defaultTheme.accentColor}60`,
                      color: selectedTemplate.defaultTheme.accentColor,
                      backgroundColor: `${selectedTemplate.defaultTheme.accentColor}15`,
                    }}
                  >
                    {previewMeta.badgeText}
                  </span>
                </div>

                {/* Name & Title */}
                <div className="px-4 pt-3 space-y-0.5">
                  <h4 className="text-base font-black truncate">
                    {name.trim() ? name : previewMeta.sampleName}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    {previewMeta.sampleTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {previewMeta.sampleCompany}
                  </p>
                </div>
              </div>

              {/* Quick Action Contact Pills */}
              <div className="px-4">
                <div className="grid grid-cols-4 gap-1.5">
                  <div
                    className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                    style={{ backgroundColor: `${selectedTemplate.defaultTheme.accentColor}20` }}
                  >
                    <Phone className="w-3.5 h-3.5" style={{ color: selectedTemplate.defaultTheme.accentColor }} />
                    <span className="text-[9px] font-bold">Call</span>
                  </div>
                  <div
                    className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                    style={{ backgroundColor: `${selectedTemplate.defaultTheme.accentColor}20` }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" style={{ color: selectedTemplate.defaultTheme.accentColor }} />
                    <span className="text-[9px] font-bold">WhatsApp</span>
                  </div>
                  <div
                    className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                    style={{ backgroundColor: `${selectedTemplate.defaultTheme.accentColor}20` }}
                  >
                    <Mail className="w-3.5 h-3.5" style={{ color: selectedTemplate.defaultTheme.accentColor }} />
                    <span className="text-[9px] font-bold">Email</span>
                  </div>
                  <div
                    className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                    style={{ backgroundColor: selectedTemplate.defaultTheme.accentColor }}
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold text-white">Save</span>
                  </div>
                </div>
              </div>

              {/* About Narrative Snippet */}
              <div className="px-4">
                <div
                  className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                    previewThemeMode === "dark"
                      ? "bg-slate-900/80 border-white/5 text-slate-300"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    About & Bio
                  </div>
                  <p className="text-[11px] leading-relaxed line-clamp-3">
                    {previewMeta.sampleBio}
                  </p>
                </div>
              </div>

              {/* Services Sample */}
              <div className="px-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Services Catalog
                </div>
                {previewMeta.sampleServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      previewThemeMode === "dark"
                        ? "bg-slate-900/60 border-white/5"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="font-semibold text-[11px]">{srv.title}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      style={{
                        backgroundColor: `${selectedTemplate.defaultTheme.accentColor}25`,
                        color: selectedTemplate.defaultTheme.accentColor,
                      }}
                    >
                      {srv.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Lead Capture Form CTA */}
              <div className="px-4 pt-1">
                <div
                  className="w-full py-2.5 rounded-xl text-white text-center text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: selectedTemplate.defaultTheme.accentColor }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Direct Inquiry</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            Real-time layout simulation of <strong className="text-slate-700 dark:text-slate-200">{selectedTemplate.name}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
