import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { ResponsiveSidebar } from "@/components/layout/ResponsiveSidebar";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session || !session.user || !session.workspace) {
    return redirect("/login");
  }

  const [isAdmin, profiles] = await Promise.all([
    ["ops_staff", "support_staff", "super_admin"].includes(session.user.role),
    getWorkspaceProfiles(session.workspace.id),
  ]);

  const primaryProfileId = profiles.length > 0 ? profiles[0].id : undefined;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
      <ResponsiveSidebar
        session={session}
        isAdmin={isAdmin}
        logoutAction={logoutAction}
        primaryProfileId={primaryProfileId}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {isAdmin && (
          <div className="bg-gradient-to-r from-purple-950/60 via-slate-950 to-purple-950/60 border-b border-purple-500/20 px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2 text-purple-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                Staff Mode Active: You are in <strong>User Workspace</strong> view.
              </span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold text-xs hover:underline"
            >
              <span>Switch to Admin Console</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
