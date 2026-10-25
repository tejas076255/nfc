"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowRight,
  FileText,
  AlertCircle,
  Clock,
  Download,
  Zap,
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

export function BillingClientView({
  currentPlan,
  subscription,
  allPlans,
  invoices,
  activeProfilesCount,
}: {
  currentPlan: PlanItem;
  subscription: any;
  allPlans: PlanItem[];
  invoices: InvoiceItem[];
  activeProfilesCount: number;
}) {
  const router = useRouter();
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        text: `Successfully upgraded to ${data.planName}! Your workspace features are now active.`,
      });

      router.refresh();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "An unexpected error occurred during upgrade.",
      });
    } finally {
      setLoadingCode(null);
    }
  };

  const planOrder = ["free", "starter", "professional", "business_pro"];
  const sortedPlans = [...allPlans].sort(
    (a, b) => planOrder.indexOf(a.code) - planOrder.indexOf(b.code)
  );

  return (
    <div className="space-y-10">
      {/* Status Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* ACTIVE SUBSCRIPTION OVERVIEW CARD */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Active Subscription
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {subscription ? subscription.status.toUpperCase() : "FREE TIER"}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentPlan.name}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Annual SaaS subscription for your NFC digital cards and lead management CRM. You are currently using{" "}
              <span className="font-bold text-white">{activeProfilesCount}</span> of{" "}
              <span className="font-bold text-white">
                {currentPlan.profileLimit >= 999 ? "Unlimited" : currentPlan.profileLimit}
              </span>{" "}
              active digital profiles.
            </p>

            {/* Fallback Protection Guarantee */}
            <div className="flex items-start gap-2.5 pt-2 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5 max-w-xl">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Zero-Data Loss Guarantee:</strong> If your subscription lapses, your customer leads and card data remain intact. Your primary card profile stays active as a fallback.
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Billed Annually</div>
              <div className="text-2xl font-black text-white mt-0.5">
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
          <h2 className="text-xl font-bold text-white">Available Plans & Upgrades</h2>
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
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">
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
          <h2 className="text-xl font-bold text-white">Invoices & Receipts</h2>
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
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
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
                        <td className="py-3.5 px-4 font-bold text-white">
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
  );
}
