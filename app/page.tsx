import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { TapbezLovableLanding } from "@/components/landing/TapbezLovableLanding";

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string; source?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  if (params.mode === "app" || params.source === "pwa") {
    const cookieStore = await cookies();
    let slug = cookieStore.get("last_profile_slug")?.value || "htt-5311";
    if (slug === "htt") slug = "htt-5311";
    redirect(`/p/${slug}`);
  }

  const session = await getCurrentSession();

  return <TapbezLovableLanding sessionUser={session?.user} />;
}
