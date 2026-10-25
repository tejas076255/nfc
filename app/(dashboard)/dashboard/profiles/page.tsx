import React from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceProfiles, getWorkspaceSubscriptionPlan } from "@/lib/profiles/service";
import {
  Sliders,
  Plus,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default async function ProfilesListPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return null;

  const [profiles, planInfo] = await Promise.all([
    getWorkspaceProfiles(session.workspace.id),
    getWorkspaceSubscriptionPlan(session.workspace.id),
  ]);

  const publishedCount = profiles.filter((p) => p.status === "published").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Digital Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your mobile-first business identities and published versions.
          </p>
        </div>

        <Link
          href="/dashboard/profiles/new"
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Profile</span>
        </Link>
      </div>

      {/* Quota tracker */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-slate-300">
            Published Profiles: <strong className="text-white">{publishedCount}</strong> of{" "}
            <strong className="text-white">{planInfo.profileLimit}</strong> allowed under {planInfo.planName}
          </span>
        </div>
        <Link href="/dashboard/billing" className="text-blue-400 hover:underline font-semibold text-xs shrink-0">
          Manage Plan
        </Link>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
            <Sliders className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No Profiles Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by creating your first digital business profile using one of our 6 industry templates.
            </p>
            <Link
              href="/dashboard/profiles/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Profile</span>
            </Link>
          </div>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                      profile.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {profile.status}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 capitalize">
                    {profile.industry.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white truncate">{profile.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{profile.title || "No title set"}</p>
                <p className="text-[11px] text-blue-400 font-mono truncate">/p/{profile.slug}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{profile.viewsCount} views</span>
                </div>

                <div className="flex items-center gap-2">
                  {profile.status === "published" && (
                    <Link
                      href={`/p/${profile.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Open Live Public Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/profiles/${profile.id}/edit`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Edit Blocks
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
