import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceLeads } from "@/lib/leads/service";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { LeadsClientView } from "@/components/leads/LeadsClientView";
import { redirect } from "next/navigation";

export default async function DashboardLeadsPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const [leads, profiles] = await Promise.all([
    getWorkspaceLeads(session.workspace.id),
    getWorkspaceProfiles(session.workspace.id),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <LeadsClientView
        initialLeads={leads}
        profiles={profiles}
        workspaceId={session.workspace.id}
      />
    </div>
  );
}
