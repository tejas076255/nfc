import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import {
  getWorkspaceSubscription,
  getAllPlans,
  getWorkspaceInvoices,
} from "@/lib/billing/service";
import { getWorkspacePublishedProfilesCount } from "@/lib/profiles/service";
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

  const [{ plan: currentPlan, subscription }, allPlans, invoices, activeProfilesCount] =
    await Promise.all([
      getWorkspaceSubscription(session.workspace.id),
      getAllPlans(),
      getWorkspaceInvoices(session.workspace.id),
      getWorkspacePublishedProfilesCount(session.workspace.id),
    ]);

  return (
    <div className="p-3.5 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
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
