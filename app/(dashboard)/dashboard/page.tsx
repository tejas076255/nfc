import React from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceProfiles, getWorkspaceSubscriptionPlan } from "@/lib/profiles/service";
import { getWorkspaceCards } from "@/lib/cards/service";
import { getWorkspaceLeads } from "@/lib/leads/service";
import { getWorkspaceAnalyticsSummary } from "@/lib/analytics/service";
import {
  Users,
  CreditCard,
  Eye,
  TrendingUp,
  Sliders,
  ExternalLink,
  Plus,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return null;

  const workspaceId = session.workspace.id;

  const [profiles, cards, leads, planInfo, analytics] = await Promise.all([
    getWorkspaceProfiles(workspaceId),
    getWorkspaceCards(workspaceId),
    getWorkspaceLeads(workspaceId),
    getWorkspaceSubscriptionPlan(workspaceId),
    getWorkspaceAnalyticsSummary(workspaceId),
  ]);

  const publishedProfiles = profiles.filter((p) => p.status === "published");
  const activeCards = cards.filter((c) => c.activationStatus === "active");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner: Workspace Greeting & Plan Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workspace Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing <span className="text-slate-200 font-semibold">{session.workspace.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/dashboard/profiles/new"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Profile</span>
          </Link>

          <Link
            href="/orders/new"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Order NFC Card</span>
          </Link>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Published Profiles vs Quota */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Published Profiles</span>
            <Sliders className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {publishedProfiles.length}
            </span>
            <span className="text-xs text-slate-400">
              / {planInfo.profileLimit} limit
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (publishedProfiles.length / planInfo.profileLimit) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Active NFC Cards */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active NFC Cards</span>
            <Wifi className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeCards.length}
            </span>
            <span className="text-xs text-slate-400">linked</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {cards.length} total card(s) in account
          </p>
        </div>

        {/* Total Leads Captured */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Leads Captured</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {leads.length}
            </span>
            <span className="text-xs text-slate-400">inquiries</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {analytics.conversionRate}% conversion rate
          </p>
        </div>

        {/* Profile Views & Opens */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Interactions</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {analytics.profileViews}
            </span>
            <span className="text-xs text-slate-400">views</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {analytics.nfcOpens} NFC taps · {analytics.qrOpens} QR scans
          </p>
        </div>
      </div>

      {/* PLAN ENTITLEMENT ALERT IF NEAR/AT LIMIT */}
      {publishedProfiles.length >= planInfo.profileLimit && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                You have reached your {planInfo.planName} published profile quota ({planInfo.profileLimit}/{planInfo.profileLimit})
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upgrade to Starter (3 profiles) or Professional (10 profiles) to publish more cards.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap transition-colors"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* TWO COLUMN GRID: DIGITAL PROFILES & RECENT LEADS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Profiles List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Digital Profiles</span>
            </h2>
            <Link
              href="/dashboard/profiles"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View All ({profiles.length})
            </Link>
          </div>

          <div className="space-y-3">
            {profiles.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center space-y-3 border border-white/10">
                <p className="text-xs text-slate-400">
                  You haven&apos;t created any digital profiles yet.
                </p>
                <Link
                  href="/dashboard/profiles/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Profile</span>
                </Link>
              </div>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{profile.name}</h3>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          profile.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {profile.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {profile.title || "No title"} · <span className="capitalize">{profile.industry.replace("_", " ")}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {profile.status === "published" && (
                      <Link
                        href={`/p/${profile.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Public Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/profiles/${profile.id}/edit`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Leads */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Recent Leads</span>
            </h2>
            <Link
              href="/dashboard/leads"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              Inbox ({leads.length})
            </Link>
          </div>

          <div className="space-y-3">
            {leads.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center space-y-2 border border-white/10">
                <p className="text-xs text-slate-400">
                  No visitor inquiries yet.
                </p>
                <p className="text-[11px] text-slate-500">
                  Share your NFC card or QR code to begin capturing leads.
                </p>
              </div>
            ) : (
              leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="glass-card p-3.5 rounded-xl border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lead.visitorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-mono">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {lead.phone} {lead.email ? `· ${lead.email}` : ""}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Source: {lead.sourceType}</span>
                    <span>{new Date(lead.createdAt * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
