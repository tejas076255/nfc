import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceAnalyticsSummary } from "@/lib/analytics/service";
import { redirect } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Wifi,
  QrCode,
  Download,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default async function DashboardAnalyticsPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const analytics = await getWorkspaceAnalyticsSummary(session.workspace.id, 30);
  const maxDailyViews = Math.max(1, ...analytics.dailyTrend.map((d: any) => d.views));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Analytics & Source Attribution
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time event telemetry and conversion metrics for the last 30 days.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligible Profile Views</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {analytics.profileViews}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Filtered for known bot crawlers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Physical NFC Taps</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wifi className="w-4 h-4 rotate-90" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {analytics.nfcOpens}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Unique NFC redirect requests</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">QR Scans</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {analytics.qrOpens}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct & campaign QR scans</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lead Conversion</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {analytics.conversionRate}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {analytics.leadSubmissions} verified leads from views
          </p>
        </div>
      </div>

      {/* Secondary Conversion CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Save Contact (.vcf) Downloads</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.saveContactClicks}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">One-click phonebook saves</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">WhatsApp Chats Initiated</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.whatsappClicks}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct click-to-chat opens</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN: 7-DAY ACTIVITY TREND & SOURCE CHANNEL ATTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>7-Day Interaction Trend</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Daily Volume</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200 dark:border-white/10 pb-4">
            {analytics.dailyTrend.map((d: any, i: number) => {
              const heightPercent = Math.max(8, Math.round((d.views / maxDailyViews) * 100));

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.views}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                    {d.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Profile Views</span>
            </div>
          </div>
        </div>

        {/* Source Attribution Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Channel Attribution</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Taps vs Scans</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Physical NFC Taps</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{analytics.sourceCounts.nfc || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((analytics.sourceCounts.nfc || 0) / (analytics.profileViews || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">QR Code Scans</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{analytics.sourceCounts.qr || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((analytics.sourceCounts.qr || 0) / (analytics.profileViews || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Direct URL & Shared Links</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{analytics.sourceCounts.direct || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((analytics.sourceCounts.direct || 0) / (analytics.profileViews || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Every NFC tap and QR scan is logged without invading visitor privacy or tracking personally identifiable device IDs.
          </div>
        </div>
      </div>
    </div>
  );
}
