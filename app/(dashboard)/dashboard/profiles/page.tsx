import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceProfiles, getWorkspaceSubscriptionPlan } from "@/lib/profiles/service";
import { ProfilesClientView } from "@/components/profiles/ProfilesClientView";

export const metadata = {
  title: "Digital Profiles & Team Cards | TapSync",
  description: "Manage your business profiles, team cards, and employee NFC identities.",
};

export default async function ProfilesListPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return null;

  const [profiles, planInfo] = await Promise.all([
    getWorkspaceProfiles(session.workspace.id),
    getWorkspaceSubscriptionPlan(session.workspace.id),
  ]);

  return (
    <ProfilesClientView
      initialProfiles={profiles as any}
      planInfo={planInfo}
    />
  );
}
