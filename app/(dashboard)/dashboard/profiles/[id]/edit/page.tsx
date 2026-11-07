import React from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getProfileById } from "@/lib/profiles/service";
import { getWorkspaceSubscription } from "@/lib/billing/service";
import { ProfileEditor } from "@/components/profile-builder/ProfileEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProfilePage({ params }: PageProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const { id } = await params;
  const [profile, subData] = await Promise.all([
    getProfileById(id, session.workspace.id),
    getWorkspaceSubscription(session.workspace.id),
  ]);

  if (!profile) {
    return notFound();
  }

  const isPremium = Boolean(
    (subData.plan && subData.plan.code !== "free" && subData.plan.priceAnnualInr > 0) ||
    (subData.subscription && subData.subscription.status === "active")
  );

  return (
    <ProfileEditor
      initialProfile={profile}
      workspaceId={session.workspace.id}
      isPremium={isPremium}
    />
  );
}
