import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getAllOrders } from "@/lib/billing/service";
import { getAllCardsForAdmin, getAuditLogs } from "@/lib/cards/service";
import { AdminStationView } from "@/components/admin/AdminStationView";
import { ShieldCheck, ArrowRight, LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "Super Admin Control Center | TapSync Operations",
  description: "Operations, hardware QA inspection, card provisioning, and order fulfillment management.",
};

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const isStaff = ["ops_staff", "support_staff", "super_admin"].includes(session.user.role);
  if (!isStaff) {
    redirect("/dashboard");
  }

  const [orders, cards, auditLogs] = await Promise.all([
    getAllOrders(),
    getAllCardsForAdmin(100),
    getAuditLogs(50),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      {/* ADMIN TOP BAR */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 md:px-10 py-3 sm:py-0 min-h-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>TapSync Hardware & Operations Terminal</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Live Cloudflare D1
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch to User Dashboard</span>
          </Link>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
        <AdminStationView
          orders={orders as any}
          cards={cards as any}
          auditLogs={auditLogs as any}
        />
      </div>
    </div>
  );
}
