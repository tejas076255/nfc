import React, { cache } from "react";
import Link from "next/link";
import { getPublishedProfileBySlug } from "@/lib/profiles/service";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import { PublicProfileView } from "@/components/public-profile/PublicProfileView";
import { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string; token?: string }>;
}

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

  const blocks = profile.blocks || [];
  const headerBlock = blocks.find((b) => b.type === "identity_header" && b.isEnabled)?.blockData || {};

  const title = `${profile.name} | TapSync NFC`;
  const description = profile.bio || headerBlock.tagline || `Connect with ${profile.name} on TapSync NFC.`;

  // Provide high-resolution .jpg avatar endpoint for WhatsApp, iMessage & Twitter crawlers
  const avatarEndpoint = `https://nfc-business-card-saas.tejasgogavale5.workers.dev/api/avatar/${slug}.jpg`;

  return {
    title,
    description,
    robots: {
      index: profile.searchIndexed,
      follow: profile.searchIndexed,
    },
    icons: {
      icon: avatarEndpoint,
      shortcut: avatarEndpoint,
      apple: avatarEndpoint,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: "TapSync NFC",
      images: [
        {
          url: avatarEndpoint,
          secureUrl: avatarEndpoint,
          width: 300,
          height: 300,
          type: "image/jpeg",
          alt: profile.name,
        },
      ],
    },
    twitter: {
      card: "summary", // "summary" renders the square image on the LEFT side of text
      title,
      description,
      images: [avatarEndpoint],
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { src = "direct", token } = await searchParams;

  const profile = await getCachedProfile(slug);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <span className="text-2xl font-bold">404</span>
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

  // Non-blocking analytics logging (fail-safe)
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    const ip = headerList.get("x-forwarded-for") || headerList.get("cf-connecting-ip") || "";

    logAnalyticsEvent({
      workspaceId: (profile as any).workspaceId || profile.id,
      profileId: profile.id,
      eventType: "profile_view",
      sourceToken: token,
      sourceType: src,
      userAgent,
      ipHash: ip.slice(0, 8),
    });
  } catch {
    // Analytics should never crash public profile rendering
  }

  const avatarEndpoint = `https://nfc-business-card-saas.tejasgogavale5.workers.dev/api/avatar/${slug}.jpg`;

  return (
    <>
      <link rel="icon" href={avatarEndpoint} />
      <link rel="apple-touch-icon" href={avatarEndpoint} />
      <link rel="image_src" href={avatarEndpoint} />
      <PublicProfileView profile={profile} sourceType={src} sourceToken={token} />
    </>
  );
}
