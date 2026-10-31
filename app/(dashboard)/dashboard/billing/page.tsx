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

export const metadata = {
  title: "Subscription & Billing | TapSync",
  description: "Manage your annual SaaS plan, profile quotas, team members, and CRM integrations.",
};

interface DashboardBillingPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardBillingPage({ searchParams }: DashboardBillingPageProps) {
  const session = await getCurrentSession();
  if (!session || !session.workspace) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const initialTab = resolvedParams?.tab || "billing";

  const [{ plan: currentPlan, subscription }, allPlans, invoices, profiles] =
    await Promise.all([
      getWorkspaceSubscription(session.workspace.id),
      getAllPlans(),
      getWorkspaceInvoices(session.workspace.id),
      getWorkspaceProfiles(session.workspace.id),
    ]);

  const activeProfilesCount = profiles.filter((p) => p.status === "published").length;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <BillingClientView
        currentPlan={currentPlan as any}
        subscription={subscription}
        allPlans={allPlans as any}
        invoices={invoices as any}
        activeProfilesCount={activeProfilesCount}
        initialTab={initialTab}
        workspaceName={session.workspace.name}
        userName={session.user.name}
        userEmail={session.user.email}
        membershipRole={session.membershipRole}
      />
    </div>
  );
}
