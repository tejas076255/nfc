import React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceProfiles } from "@/lib/profiles/service";
import { ClaimCardForm } from "@/components/cards/ClaimCardForm";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ token?: string; secret?: string }>;
}

export default async function RetailCardClaimPage({ searchParams }: PageProps) {
  const session = await getCurrentSession();
  const resolvedParams = searchParams ? await searchParams : undefined;
  const token = resolvedParams?.token || "";
  const secret = resolvedParams?.secret || "";

  if (!session?.workspace) {
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    if (secret) params.set("secret", secret);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const returnUrl = `/cards/claim${qs}`;
    return redirect(`/login?returnTo=${encodeURIComponent(returnUrl)}`);
  }

  const profiles = (await getWorkspaceProfiles(session.workspace.id)) || [];

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        <ClaimCardForm
          profiles={profiles}
          initialSecret={secret}
          initialToken={token}
        />
      </div>
    </div>
  );
}
