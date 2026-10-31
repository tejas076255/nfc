import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SupportClientView } from "@/components/support/SupportClientView";

export default async function DashboardSupportPage() {
  const session = await getCurrentSession();
  if (!session?.workspace) return redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <SupportClientView
        user={{
          name: session.user.name,
          email: session.user.email,
        }}
      />
    </div>
  );
}

