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
  Shield,
} from "lucide-react";

interface NewProfileClientViewProps {
  totalProfiles: number;
  profileLimit: number;
  planName: string;
  isLimitReached: boolean;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry }),
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
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Digital Profiles</span>
        </Link>

        {/* Limit Reached Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

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
            <strong className="text-white">{profileLimit}</strong> digital business card profile(s). To create and deploy additional profiles for yourself or your team members, upgrade your plan.
          </p>

          {/* Plan Comparison Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Professional Plan</span>
                <span className="text-blue-400 font-bold">5 Cards</span>
              </div>
              <p className="text-[11px] text-slate-400">
                ₹2,499/year. Includes 5 published digital profiles, lead CRM capture & custom branding.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Business Pro Plan</span>
                <span className="text-purple-300 font-bold">25 Cards</span>
              </div>
              <p className="text-[11px] text-slate-300">
                ₹4,999/year. Includes 25 profiles, 5 Team Seats, CRM Webhook integrations & lead export.
              </p>
            </div>
          </div>

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
    <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <Link
            href="/dashboard/profiles"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profiles</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create New Digital Profile
          </h1>
          <p className="text-xs text-slate-400">
            Choose an industry template foundation. You can customize every section, theme, and vCard later.
          </p>
        </div>

        {/* Quota Badge */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-blue-500/30 text-xs self-start sm:self-auto shrink-0 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Profile Allocation
          </div>
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="text-blue-400">Card #{totalProfiles + 1}</span>
            <span className="text-slate-500">of</span>
            <span>{profileLimit >= 999 ? "Unlimited" : profileLimit}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Name */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Cardholder / Business Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Siddharth Mehta or Vertex Advisory"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-400">
            This name will be printed on the profile header and encoded into the NFC tap payload.
          </p>
        </div>

        {/* 6 Industry Template Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 px-1">
            Select Industry Template Family
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setIndustry(tmpl.industry)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  industry === tmpl.industry
                    ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-800"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {tmpl.industry.replace("_", " ")}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{tmpl.tagline}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {tmpl.defaultBlocks.length} Default Blocks
                  </span>
                  {industry === tmpl.industry && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <Link
            href="/dashboard/profiles"
            className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
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
  );
}

