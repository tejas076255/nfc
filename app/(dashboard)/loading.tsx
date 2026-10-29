import React from "react";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-800/80 rounded-xl" />
          <div className="h-4 w-32 bg-slate-800/50 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-800/80 rounded-xl" />
          <div className="h-9 w-32 bg-slate-800/80 rounded-xl" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-slate-800/70 rounded-md" />
              <div className="h-4 w-4 bg-slate-800/70 rounded-full" />
            </div>
            <div className="h-8 w-16 bg-slate-800 rounded-lg" />
            <div className="h-2 w-full bg-slate-800/60 rounded-full" />
          </div>
        ))}
      </div>

      {/* Two Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-5 w-36 bg-slate-800/70 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-white/10 h-20" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-5 w-32 bg-slate-800/70 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-white/10 h-16" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

