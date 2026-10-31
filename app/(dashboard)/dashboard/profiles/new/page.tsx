import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceProfiles, getWorkspaceSubscriptionPlan } from "@/lib/profiles/service";
import { NewProfileClientView } from "@/components/profile-builder/NewProfileClientView";

export const metadata = {
  title: "Create New Digital Profile | TapSync",
  description: "Select an industry template and launch a mobile-first digital business card.",
};

export default async function NewProfilePage() {
  const session = await getCurrentSession();
  if (!session?.workspace) {
    redirect("/login");
  }

  const [profiles, planInfo] = await Promise.all([
    getWorkspaceProfiles(session.workspace.id),
    getWorkspaceSubscriptionPlan(session.workspace.id),
  ]);

  const totalProfiles = profiles.length;
  const isLimitReached = totalProfiles >= planInfo.profileLimit;

  return (
    <NewProfileClientView
      totalProfiles={totalProfiles}
      profileLimit={planInfo.profileLimit}
      planName={planInfo.planName}
      isLimitReached={isLimitReached}
    />
  );
}
