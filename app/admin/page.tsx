import React from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentSession } from "@/lib/auth/session";
import { getAllOrders, getAllSupportTickets, getAllWorkspacesForAdmin } from "@/lib/billing/service";
import { getAllCardsForAdmin, getAuditLogs } from "@/lib/cards/service";
import { getAllProfilesForAdmin, getAdminSystemStats } from "@/lib/profiles/service";
import { AdminStationView } from "@/components/admin/AdminStationView";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, Activity } from "lucide-react";

export const metadata = {
  title: "Admin Executive Terminal | tapbez",
  description: "Operations, hardware QA inspection, slot allocation, user support inquiries, and card order fulfillment.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const isStaff = ["super_admin", "ops_staff", "support_staff"].includes(session.user.role);

  if (!isStaff) {
    redirect("/dashboard");
  }

  const [orders, cards, auditLogs, allProfiles, systemStats, supportTickets, workspaces] =
    await Promise.all([
      getAllOrders(),
      getAllCardsForAdmin(100),
      getAuditLogs(50),
      getAllProfilesForAdmin(100),
      getAdminSystemStats(),
      getAllSupportTickets(),
      getAllWorkspacesForAdmin(),
    ]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#07090f] text-slate-900 dark:text-slate-100 min-h-screen">
      {/* ADMIN TOP BAR */}
      <header className="border-b border-slate-200 dark:border-amber-500/15 bg-white/95 dark:bg-[#07090f]/90 backdrop-blur-xl px-4 sm:px-6 md:px-10 py-3 sm:py-0 min-h-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 flex items-center justify-center p-1 text-amber-500 shrink-0 shadow-xs">
            <Image
              src="/tapbez-emblem.png"
              alt="tapbez"
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>tapbez Executive Hardware & Operations Terminal</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloudflare D1
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>Staff: {session.user.name}</span>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
        <AdminStationView
          orders={orders as any}
          cards={cards as any}
          auditLogs={auditLogs as any}
          profiles={allProfiles as any}
          stats={systemStats}
          initialSupportTickets={supportTickets as any}
          initialWorkspaces={workspaces as any}
        />
      </div>
    </div>
  );
}
