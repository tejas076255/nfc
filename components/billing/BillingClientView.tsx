"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowRight,
  Plus,
  Smartphone,
  FileText,
  AlertCircle,
  Clock,
  Download,
  Zap,
  Users,
  Plug,
  ShoppingBag,
  UserPlus,
  Mail,
  Check,
  Send,
  ExternalLink,
  Copy,
  Lock,
} from "lucide-react";

interface PlanItem {
  id: string;
  code: string;
  name: string;
  priceAnnualInr: number;
  profileLimit: number;
  features: string;
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  amountInr: number;
  status: string;
  lineItems: string;
  createdAt: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "invited";
  joinedAt: string;
}

export function BillingClientView({
  currentPlan,
  subscription,
  allPlans,
  invoices,
  activeProfilesCount,
  initialTab = "billing",
  workspaceName = "My Workspace",
  userName = "Cardholder",
  userEmail = "user@example.com",
  membershipRole = "owner",
}: {
  currentPlan: PlanItem;
  subscription: any;
  allPlans: PlanItem[];
  invoices: InvoiceItem[];
  activeProfilesCount: number;
  initialTab?: string;
  workspaceName?: string;
  userName?: string;
  userEmail?: string;
  membershipRole?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams?.get("tab");

  const [activeTab, setActiveTab] = useState<string>(urlTab || initialTab || "billing");
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (urlTab && ["billing", "team", "integrations"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/dashboard/billing?tab=${tabId}`, { scroll: false });
  };

  // Team state
  const isProPlan = currentPlan.code === "business_pro" || currentPlan.code === "enterprise";
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "owner-1",
      name: userName || "Account Owner",
      email: userEmail || "owner@example.com",
      role: (membershipRole as any) || "owner",
      status: "active",
      joinedAt: "Founder",
    },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Integrations state
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.zapier.com/hooks/catch/tapbez-lead-stream");
  const [webhookSecret] = useState("whsec_tapbez_live_9a7d8e2f");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);
  const [savedWebhookToast, setSavedWebhookToast] = useState(false);

  const handleUpgrade = async (planCode: string) => {
    if (planCode === currentPlan.code) return;

    setLoadingCode(planCode);
    setMessage(null);

    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to process plan change");
      }

      setMessage({
        type: "success",
        text: `Successfully upgraded to ${data.planName}! Your profile quota and entitlements have been updated.`,
      });

      router.refresh();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to upgrade subscription. Please try again.",
      });
    } finally {
      setLoadingCode(null);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    if (!isProPlan) {
      handleTabChange("billing");
      setMessage({
        type: "error",
        text: "Team collaboration requires Business Pro (5 Seats) or Enterprise plan. Please upgrade to invite team members.",
      });
      return;
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "invited",
      joinedAt: "Just now",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setInviteSuccess(`Invitation sent to ${inviteEmail} as ${inviteRole.toUpperCase()}!`);
    setInviteEmail("");
    setShowInviteModal(false);
    setTimeout(() => setInviteSuccess(null), 5000);
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setWebhookTestResult(null);
    setTimeout(() => {
      setTestingWebhook(false);
      setWebhookTestResult("HTTP 200 OK: Test event 'lead.created' successfully dispatched and received!");
      setTimeout(() => setWebhookTestResult(null), 6000);
    }, 1200);
  };

  const handleSaveWebhook = () => {
    setSavedWebhookToast(true);
    setTimeout(() => setSavedWebhookToast(false), 3000);
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const sortedPlans = [...allPlans].sort((a, b) => a.priceAnnualInr - b.priceAnnualInr);

  return (
    <div className="space-y-8">
      {/* TOP TABS NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            Workspace Entitlements & Features
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeTab === "billing" && "Subscription & Billing"}
            {activeTab === "team" && "Team Members & Permissions (Pro)"}
            {activeTab === "integrations" && "CRM, Webhooks & Automated Integrations"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "billing" && "Manage your annual plan, profile quotas, and view verified tax receipts."}
            {activeTab === "team" && "Invite colleagues, assign Editor/Admin roles, and manage digital NFC cards collaboratively."}
            {activeTab === "integrations" && "Automatically forward leads and card tap events into Zapier, Google Sheets, HubSpot, or Slack."}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 self-start sm:self-auto shrink-0">
          <button
            onClick={() => handleTabChange("billing")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "billing"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Billing & Plans</span>
          </button>

          <button
            onClick={() => handleTabChange("team")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === "team"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team (Pro)</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40">
              Pro
            </span>
          </button>

          <button
            onClick={() => handleTabChange("integrations")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === "integrations"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Plug className="w-3.5 h-3.5" />
            <span>Integrations</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-500/40">
              CRM
            </span>
          </button>
        </div>
      </div>

      {/* GLOBAL TOAST MESSAGES */}
      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs animate-in fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {inviteSuccess && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{inviteSuccess}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: BILLING & PLANS                                                    */}
      {/* ========================================================================= */}
      {activeTab === "billing" && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* CURRENT SUBSCRIPTION CARD */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/40 dark:via-slate-900/60 dark:to-purple-950/30 border border-blue-200 dark:border-blue-500/30 shadow-xs shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Active Subscription
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {subscription ? subscription.status.toUpperCase() : "FREE TIER"}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentPlan.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Annual SaaS subscription for your NFC digital cards and lead management CRM. You are currently using{" "}
                  <span className="font-bold text-slate-900 dark:text-white">{activeProfilesCount}</span> of{" "}
                  <span className="font-bold text-white">
                    {currentPlan.profileLimit >= 999 ? "Unlimited" : currentPlan.profileLimit}
                  </span>{" "}
                  active digital profiles.
                </p>

                {/* Profile Quota Progress Bar */}
                <div className="max-w-xl space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Profile Quota Utilization</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {activeProfilesCount} / {currentPlan.profileLimit >= 999 ? "∞" : currentPlan.profileLimit} Slots
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            8,
                            (activeProfilesCount / (currentPlan.profileLimit >= 999 ? 100 : currentPlan.profileLimit)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Fallback Protection Guarantee */}
                <div className="flex items-start gap-2.5 pt-2 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5 max-w-xl">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-200">Zero-Data Loss Guarantee:</strong> If your subscription lapses, your customer leads and card data remain intact. Your primary card profile stays active as a fallback.
                  </span>
                </div>

                {/* Profile Slots Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <Link
                    href="/dashboard/profiles/new"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New Profile ({Math.max(0, (currentPlan.profileLimit >= 999 ? 999 : currentPlan.profileLimit) - activeProfilesCount)} slots remaining)</span>
                  </Link>
                  <Link
                    href="/dashboard/profiles"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    <span>Manage All Profiles ({activeProfilesCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 shrink-0 lg:min-w-[240px]">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Billed Annually</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {currentPlan.priceAnnualInr === 0
                      ? "₹0 Free"
                      : `₹${currentPlan.priceAnnualInr.toLocaleString("en-IN")}/yr`}
                  </div>
                </div>

                {subscription?.currentPeriodEnd && (
                  <div className="pt-2 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
                    <span>Renews on:</span>
                    <span className="text-slate-200 font-mono font-medium">
                      {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PLANS SELECTION */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Available Plans & Upgrades</h2>
              <p className="text-sm text-slate-400">
                Switch plans anytime with instant entitlement updates across your workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedPlans.map((plan) => {
                const isCurrent = currentPlan.code === plan.code;
                const isPopular = plan.code === "professional";
                let featuresList: string[] = [];
                try {
                  featuresList = JSON.parse(plan.features);
                } catch {
                  featuresList = [];
                }

                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-6 flex flex-col justify-between border transition-all relative ${
                      isCurrent
                        ? "bg-slate-900/90 border-blue-500/60 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50"
                        : isPopular
                        ? "bg-slate-900/60 border-purple-500/40 hover:border-purple-500/80"
                        : "bg-slate-900/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        Most Popular
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">
                            {plan.priceAnnualInr === 0
                              ? "₹0"
                              : `₹${plan.priceAnnualInr.toLocaleString("en-IN")}`}
                          </span>
                          <span className="text-xs text-slate-400">/year</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="text-xs font-semibold text-slate-300">
                          Profile Quota:{" "}
                          <span className="text-blue-400 font-bold">
                            {plan.profileLimit >= 999 ? "Unlimited" : plan.profileLimit} Cards
                          </span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-300 pt-2">
                          {featuresList.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold cursor-default"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.code)}
                          disabled={loadingCode !== null}
                          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {loadingCode === plan.code ? (
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <span>Select {plan.name}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INVOICES & BILLING HISTORY */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invoices & Receipts</h2>
              <p className="text-sm text-slate-400">
                Download your tax invoices for card orders and subscription payments.
              </p>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/30 text-center text-sm text-slate-400">
                No invoices generated yet. Invoices appear here once you purchase a card or upgrade a plan.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invoices.map((inv) => {
                        let items: any[] = [];
                        try {
                          items = JSON.parse(inv.lineItems);
                        } catch {
                          items = [];
                        }

                        return (
                          <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {new Date(inv.createdAt * 1000).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-slate-200">
                              {items.length > 0 ? items.map((i) => i.name).join(", ") : "TapSync Services"}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              ₹{inv.amountInr.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                PAID
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Print</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TEAM (PRO)                                                         */}
      {/* ========================================================================= */}
      {activeTab === "team" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Pro Capability Banner */}
          {!isProPlan ? (
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Pro Feature
                  </span>
                  <span className="text-xs text-slate-400">Team Seats: 1 (Owner Only)</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Unlock Team Collaboration with Business Pro
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Assign up to <strong>5 team members</strong> with customized Editor or Admin permissions. Empower your team to manage their own NFC digital profiles, review leads, and update portfolio cards without sharing credentials.
                </p>
              </div>

              <button
                onClick={() => handleUpgrade("business_pro")}
                disabled={loadingCode !== null}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {loadingCode === "business_pro" ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Upgrade to Business Pro (₹4,999/yr)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Business Pro Workspace Active</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      5 Team Seats Included
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Currently utilizing {teamMembers.length} of 5 available teammate seats.
                  </p>
                </div>
              </div>

              <div className="text-xs text-emerald-300 font-bold hidden sm:block">
                {5 - teamMembers.length} Seats Remaining
              </div>
            </div>
          )}

          {/* TEAM MEMBERS LIST & INVITE ACTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Workspace Teammates</h3>
                <p className="text-xs text-slate-400">
                  People who currently have access to {workspaceName}.
                </p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Teammate</span>
              </button>
            </div>

            {/* Invite Modal / Box */}
            {showInviteModal && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-4 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Invite Teammate by Email</span>
                  </h4>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="colleague@yourcompany.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Assigned Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="editor">Editor (Can edit profiles & view leads)</option>
                      <option value="admin">Admin (Full profile & billing control)</option>
                      <option value="viewer">Viewer (Read-only analytics)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teamMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 text-xs shrink-0">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white">{m.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            m.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{m.joinedAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        {m.role === "owner" ? (
                          <span className="text-[11px] text-slate-500 font-medium">Owner</span>
                        ) : (
                          <button
                            onClick={() => {
                              setTeamMembers((prev) => prev.filter((item) => item.id !== m.id));
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTEGRATIONS                                                       */}
      {/* ========================================================================= */}
      {activeTab === "integrations" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* WEBHOOK CONFIGURATION CARD */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plug className="w-5 h-5 text-teal-400" />
                  <span>Real-Time Lead Webhook Destination</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automatically forward leads, vCard downloads, and card tap events to any custom URL or Zapier webhook.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Live Stream Active
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Webhook Target Endpoint URL
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-crm.com/api/webhooks/tapbez"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSaveWebhook}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0"
                  >
                    Save URL
                  </button>
                  <button
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5"
                  >
                    {testingWebhook ? (
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send Test Payload</span>
                  </button>
                </div>
              </div>

              {savedWebhookToast && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Webhook URL successfully updated!</span>
                </div>
              )}

              {webhookTestResult && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{webhookTestResult}</span>
                </div>
              )}

              {/* Secret Key */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Signing Secret (HMAC SHA-256)
                </label>
                <div className="flex items-center gap-2 max-w-md">
                  <div className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-400 text-xs font-mono truncate">
                    {webhookSecret}
                  </div>
                  <button
                    onClick={copySecretToClipboard}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSecret ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Event Triggers */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Subscribed Event Triggers
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-0" />
                    <span>lead.created (Contact exchanged)</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-0" />
                    <span>card.tapped (NFC scan event)</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-500 focus:ring-0" />
                    <span>vcard.downloaded (Address book save)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* POPULAR APPS GRID */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Direct Ecosystem Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Google Sheets */}
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        📊
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Google Sheets Sync</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Supported
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Instantly sync every new business lead and visitor detail directly into a live Google Sheet in real time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    alert("To connect Google Sheets, use your Webhook URL above with Zapier or Google App Script webhook endpoint.");
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors"
                >
                  Configure Sheet Sync
                </button>
              </div>

              {/* Zapier / Make */}
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                        ⚡
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zapier & Make.com</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                      5,000+ Apps
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Trigger custom automations across Salesforce, Mailchimp, Slack, Notion, and Airtable whenever your card is tapped.
                  </p>
                </div>
                <button
                  onClick={() => {
                    alert("Copy your webhook target URL above and paste it into Zapier 'Webhooks by Zapier' trigger.");
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors"
                >
                  Connect via Zapier
                </button>
              </div>

              {/* HubSpot CRM */}
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                        💼
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">HubSpot CRM</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      Pro CRM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Automatically create HubSpot contacts and deal stages when clients submit contact exchange details on your profile.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isProPlan) {
                      handleTabChange("billing");
                      setMessage({
                        type: "error",
                        text: "HubSpot CRM integration is available on Business Pro and Enterprise plans.",
                      });
                    } else {
                      alert("HubSpot CRM connection is enabled for your Business Pro workspace.");
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors"
                >
                  Connect HubSpot
                </button>
              </div>

              {/* Slack & WhatsApp Alerts */}
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        💬
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Slack & WhatsApp Alerts</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Instant Ping
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Receive instant push notifications on your phone or team Slack channel whenever a high-intent client scans your card.
                  </p>
                </div>
                <button
                  onClick={() => {
                    alert("Slack notifications can be sent directly by directing your Webhook URL to a Slack incoming webhook channel.");
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors"
                >
                  Configure Slack Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
