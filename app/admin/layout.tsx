import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";
import { ResponsiveAdminSidebar } from "@/components/layout/ResponsiveAdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const isStaff = ["super_admin", "ops_staff", "support_staff"].includes(session.user.role);

  if (!isStaff) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row selection:bg-purple-600 selection:text-white transition-colors duration-150">
      <ResponsiveAdminSidebar session={session} logoutAction={logoutAction} />

      {/* ADMIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
