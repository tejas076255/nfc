import React from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getProfileById } from "@/lib/profiles/service";
import { ProfileEditor } from "@/components/profile-builder/ProfileEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProfilePage({ params }: PageProps) {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const { id } = await params;
  const profile = await getProfileById(id, session.workspace.id);

  if (!profile) {
    return notFound();
  }

  return <ProfileEditor initialProfile={profile} workspaceId={session.workspace.id} />;
}
