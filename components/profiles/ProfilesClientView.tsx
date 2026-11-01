"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sliders,
  Plus,
  ExternalLink,
  Eye,
  Sparkles,
  Edit3,
  ArrowRight,
  Smartphone,
  Users,
  Briefcase,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react";

interface ProfileItem {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  industry: string;
  status: string;
  viewsCount: number;
  createdAt: number;
}

interface PlanInfo {
  planName: string;
  profileLimit: number;
}

interface ProfilesClientViewProps {
  initialProfiles: ProfileItem[];
  planInfo: PlanInfo;
}

// Compute setup completion percentage for a profile
function calculateSetupScore(profile: ProfileItem): { percent: number; label: string; isComplete: boolean } {
  let score = 25; // Base profile creation
  if (profile.title && profile.title.trim().length > 0) score += 20;
  if (profile.bio && profile.bio.trim().length > 0) score += 20;
  if (profile.status === "published") score += 35;
  else score += 15;

  const percent = Math.min(100, score);
  return {
    percent,
    label: percent >= 90 ? "Complete" : `${percent}% Setup`,
    isComplete: percent >= 90,
  };
}

export function ProfilesClientView({ initialProfiles, planInfo }: ProfilesClientViewProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileItem[]>(initialProfiles);
  const [filterTab, setFilterTab] = useState<"all" | "primary" | "employee">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state for new employee profile
  const [empForm, setEmpForm] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    whatsapp: "",
    industry: "professional",
  });

  const publishedCount = profiles.filter((p) => p.status === "published").length;
  const primaryProfile = profiles[0] || null;
  const employeeProfiles = profiles.slice(1);

  const displayedProfiles =
    filterTab === "primary"
      ? primaryProfile ? [primaryProfile] : []
      : filterTab === "employee"
      ? employeeProfiles
      : profiles;

  const isLimitReached = profiles.length >= planInfo.profileLimit;
  const slotsRemaining = Math.max(0, planInfo.profileLimit - profiles.length);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empForm.name.trim(),
          title: empForm.title.trim() || "Team Member",
          email: empForm.email.trim(),
          phone: empForm.phone.trim(),
          whatsapp: empForm.whatsapp.trim() || empForm.phone.trim(),
          industry: empForm.industry,
          isEmployee: true,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to create employee profile");
      }

      setShowAddModal(false);
      // Redirect to edit the newly created employee profile
      router.push(`/dashboard/profiles/${data.id}/edit`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create profile");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Digital Profiles & Team Cards</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal business profile and employee digital cards under your {planInfo.planName} plan.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Add Employee Profile Button */}
          {!isLimitReached && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>+ Add Employee Profile</span>
            </button>
          )}

          {/* New Profile Standard Link */}
          {isLimitReached ? (
            <Link
              href="/dashboard/billing"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade Plan (+ Slots)</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/profiles/new"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* QUICK ACCESS BANNER TO PRIMARY CARD */}
      {primaryProfile && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-teal-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">{primaryProfile.name}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Primary Company Card
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {primaryProfile.title || "Business Profile"} • Full 8-step builder, live preview & vCard contact exchange.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/dashboard/profiles/${primaryProfile.id}/edit`}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open Profile Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Quota tracker banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Profile Quota: <strong className="text-slate-900 dark:text-white font-bold">{profiles.length}</strong> of{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                {planInfo.profileLimit >= 999 ? "Unlimited" : planInfo.profileLimit} Slots Used
              </strong>{" "}
              ({slotsRemaining} remaining for employees)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLimitReached ? (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-teal-600 dark:text-teal-400 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee Profile</span>
            </button>
          ) : (
            <Link
              href="/dashboard/billing"
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs flex items-center gap-1"
            >
              <span>Manage Quotas in Billing</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setFilterTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          All Profiles ({profiles.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("primary")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === "primary"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Primary Card (1)
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("employee")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === "employee"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Employee Profiles ({employeeProfiles.length})
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedProfiles.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">No Employee Profiles Yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Your {planInfo.planName} allows up to {planInfo.profileLimit} digital profiles. Add digital NFC business cards for your sales reps, executives, or team members.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add First Employee Profile</span>
            </button>
          </div>
        ) : (
          displayedProfiles.map((profile, index) => {
            const isPrimary = profile.id === primaryProfile?.id;
            const setup = calculateSetupScore(profile);

            return (
              <div
                key={profile.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all shadow-xs group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isPrimary
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                      }`}
                    >
                      {isPrimary ? "Primary Owner" : "Employee Profile"}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        profile.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {profile.status}
                    </span>
                  </div>

                  <Link href={`/dashboard/profiles/${profile.id}/edit`} className="block group/link cursor-pointer">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors truncate">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {profile.title || "No designation set"}
                    </p>
                  </Link>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-mono truncate">
                    /p/{profile.slug}
                  </p>

                  {/* Step-by-Step Completion Score */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-blue-500" />
                        <span>Step-by-step Setup:</span>
                      </span>
                      <span className={setup.isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                        {setup.label}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          setup.isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-blue-600 to-teal-500"
                        }`}
                        style={{ width: `${setup.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{profile.viewsCount} views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {profile.status === "published" && (
                      <Link
                        href={`/p/${profile.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Open Live Public Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/profiles/${profile.id}/edit`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{setup.isComplete ? "Edit Profile" : "Continue Setup"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD EMPLOYEE PROFILE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Employee Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create a new digital card for a sales rep, manager or team member.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-xs text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Employee Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={empForm.name}
                  onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={empForm.title}
                    onChange={(e) => setEmpForm({ ...empForm, title: e.target.value })}
                    placeholder="e.g. Senior Sales Manager"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    placeholder="rahul@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={empForm.whatsapp}
                    onChange={(e) => setEmpForm({ ...empForm, whatsapp: e.target.value })}
                    placeholder="+919876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Template Style
                </label>
                <select
                  value={empForm.industry}
                  onChange={(e) => setEmpForm({ ...empForm, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="professional">Executive Suite (Corporate & Sales)</option>
                  <option value="beauty">Luxury Atelier (Beauty & Wellness)</option>
                  <option value="real_estate">Architectural Horizon (Real Estate)</option>
                  <option value="creative">Neo Gallery (Creative & Design)</option>
                  <option value="local_business">Cornerstone Local (Local Business)</option>
                  <option value="creator">Pulse Creator (Creator & Media)</option>
                </select>
              </div>

              {/* Company Branding Note */}
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
                <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Company logo, branding, and color scheme will automatically be inherited from your primary card.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !empForm.name.trim()}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Create Employee Profile"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
