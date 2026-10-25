import React, { cache } from "react";
import Link from "next/link";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import { PublicProfileView } from "@/components/public-profile/PublicProfileView";
import { Metadata } from "next";
import { headers } from "next/headers";

// Edge Cache: Revalidate at edge every 60 seconds (sub-15ms response from edge CDN)
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string; token?: string }>;
}

// React request deduplication: ensures metadata + page only query once per render
const getCachedProfile = cache(async (slug: string) => {
  return getPublishedProfileBySlug(slug);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getCachedProfile(slug);

  if (!profile) {
    return {
      title: "Profile Not Found | TapSync NFC",
      description: "Digital business card and profile on TapSync.",
    };
  }

  return {
    title: `${profile.name} | ${profile.title || "Digital Business Card"}`,
    description: profile.bio || `Connect with ${profile.name} on TapSync NFC.`,
    robots: {
      index: profile.searchIndexed,
      follow: profile.searchIndexed,
    },
    openGraph: {
      title: `${profile.name} | TapSync NFC`,
      description: profile.bio || `Digital business card for ${profile.name}`,
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { src = "direct", token } = await searchParams;

  const profile = await getCachedProfile(slug);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Profile Unavailable</h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          This digital profile has not been published yet or is temporarily inactive.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          Create Your Own NFC Card
        </Link>
      </div>
    );
  }

  // Non-blocking analytics logging
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const ip = headerList.get("x-forwarded-for") || headerList.get("cf-connecting-ip") || "";

  logAnalyticsEvent({
    workspaceId: profile.id, // profile id or workspace
    profileId: profile.id,
    eventType: "profile_view",
    sourceToken: token,
    sourceType: src,
    userAgent,
    ipHash: ip.slice(0, 8),
  });

  return <PublicProfileView profile={profile} sourceType={src} sourceToken={token} />;
}
