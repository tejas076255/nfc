import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import {
  getWorkspaceSubscription,
  getAllPlans,
  getWorkspaceInvoices,
} from "@/lib/billing/service";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { BillingClientView } from "@/components/billing/BillingClientView";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Subscription & Billing | TapSync",
  description: "Manage your annual SaaS plan, profile quotas, and view verified tax invoices.",
};

export default async function DashboardBillingPage() {
  const session = await getCurrentSession();
  if (!session || !session.workspace) {
    redirect("/login");
  }

  const [{ plan: currentPlan, subscription }, allPlans, invoices, profiles] =
    await Promise.all([
      getWorkspaceSubscription(session.workspace.id),
      getAllPlans(),
      getWorkspaceInvoices(session.workspace.id),
      getWorkspaceProfiles(session.workspace.id),
    ]);

  const activeProfilesCount = profiles.filter((p) => p.status === "published").length;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
          <Sparkles className="w-4 h-4" />
          Workspace Entitlements
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Scale your digital business card deployment with predictable annual plans and instant quota unlocking.
        </p>
      </div>

      <BillingClientView
        currentPlan={currentPlan as any}
        subscription={subscription}
        allPlans={allPlans as any}
        invoices={invoices as any}
        activeProfilesCount={activeProfilesCount}
      />
    </div>
  );
}
