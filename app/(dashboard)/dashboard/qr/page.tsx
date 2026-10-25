import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceQrCodes } from "@/lib/qr/service";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { QrClientView } from "@/components/qr/QrClientView";
import { redirect } from "next/navigation";

export default async function DashboardQrPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  const [qrCodes, profiles] = await Promise.all([
    getWorkspaceQrCodes(session.workspace.id),
    getWorkspaceProfiles(session.workspace.id),
  ]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      <QrClientView
        initialQrCodes={qrCodes}
        profiles={profiles}
        workspaceId={session.workspace.id}
      />
    </div>
  );
}
