import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { CardOrderCheckout } from "@/components/cards/CardOrderCheckout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ variant?: string }>;
}

export default async function NewOrderPage({ searchParams }: PageProps) {
  const session = await getCurrentSession();
  const { variant } = await searchParams;

  if (!session?.workspace) {
    return redirect(`/login?returnTo=${encodeURIComponent("/orders/new")}`);
  }

  let selectedVariant: "standard_pvc" | "custom_pvc" | "custom_metal" = "custom_pvc";
  if (variant === "standard_pvc" || variant === "standard") {
    selectedVariant = "standard_pvc";
  } else if (variant === "custom_metal" || variant === "metal") {
    selectedVariant = "custom_metal";
  } else if (variant === "custom_pvc" || variant === "custom-pvc" || variant === "matte_pvc") {
    selectedVariant = "custom_pvc";
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 p-3.5 xs:p-4 sm:p-6 md:p-10 lg:p-12 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Order Custom Physical NFC Card
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalize your card print artwork, approve proofs, and configure express shipping.
          </p>
        </div>

        <CardOrderCheckout
          initialVariant={selectedVariant}
          userEmail={session.user.email}
          userName={session.user.name}
        />
      </div>
    </div>
  );
}
