import React from "react";

export default function ProfileSkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-start pb-20 selection:bg-blue-500 selection:text-white">
      {/* Mobile Card Container Skeleton */}
      <div className="w-full max-w-md min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative flex flex-col bg-slate-950/70 backdrop-blur-xl animate-pulse">
        {/* Cover Photo Skeleton with Shimmer */}
        <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        {/* Identity Header & Avatar Skeleton */}
        <div className="px-6 -mt-16 sm:-mt-20 relative z-10 flex flex-col items-center text-center">
          {/* Avatar Squircle */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-slate-950 border-2 border-white/15 shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-xl bg-slate-800/90 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
            </div>
          </div>

          {/* Name & Title Shimmers */}
          <div className="mt-4 space-y-2 flex flex-col items-center w-full">
            <div className="h-6 sm:h-7 w-48 rounded-lg bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
            </div>
            <div className="h-4 w-36 rounded-md bg-slate-800/70 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
            </div>
            <div className="h-3.5 w-24 rounded-md bg-slate-800/50" />
          </div>

          {/* Dual Action CTA Buttons Skeleton */}
          <div className="w-full mt-6 grid grid-cols-2 gap-3">
            <div className="h-12 rounded-xl bg-blue-600/30 border border-blue-500/20" />
            <div className="h-12 rounded-xl bg-slate-800/80 border border-white/10" />
          </div>

          {/* Quick Contact Action Icons (Phone, Mail, WhatsApp, Globe) */}
          <div className="w-full mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-white/10" />
            <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-white/10" />
            <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-white/10" />
            <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-white/10" />
          </div>
        </div>

        {/* Content Blocks Skeleton */}
        <div className="px-6 py-6 space-y-4">
          {/* About Bio Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="h-4 w-20 rounded bg-slate-800/80" />
            <div className="h-3 w-full rounded bg-slate-800/50" />
            <div className="h-3 w-4/5 rounded bg-slate-800/50" />
            <div className="h-3 w-2/3 rounded bg-slate-800/50" />
          </div>

          {/* Services / Offerings Cards */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="h-4 w-28 rounded bg-slate-800/80" />
            <div className="h-14 rounded-xl bg-slate-800/40 border border-white/5" />
            <div className="h-14 rounded-xl bg-slate-800/40 border border-white/5" />
          </div>

          {/* Social Links Bar */}
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-around">
            <div className="w-8 h-8 rounded-full bg-slate-800/70" />
            <div className="w-8 h-8 rounded-full bg-slate-800/70" />
            <div className="w-8 h-8 rounded-full bg-slate-800/70" />
            <div className="w-8 h-8 rounded-full bg-slate-800/70" />
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-auto py-5 text-center flex flex-col items-center justify-center border-t border-white/5 space-y-1">
          <div className="h-3 w-32 rounded bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}
