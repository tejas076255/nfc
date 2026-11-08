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
  let profile = await getCachedProfile(slug);

  if (!profile && slug === "htt") {
    profile = await getCachedProfile("htt-5311");
  }

  if (!profile) {
    return {
      title: "Profile Not Found | tapbez",
      description: "Digital business card and profile on tapbez.",
    };
  }

  const blocks = profile.blocks || [];
  const headerBlock = blocks.find((b) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
  const themeConfig = profile.themeConfig || {};

  const title = themeConfig.seoTitle || `${profile.name} | tapbez`;
  const description = themeConfig.seoDescription || profile.bio || headerBlock.tagline || `Connect with ${profile.name} on tapbez.`;

  // High-resolution user avatar endpoints for mobile home screen icon, PWA, WhatsApp & Twitter crawlers
  const avatarPng = `https://tapbez.in/api/avatar/${slug}.png`;
  const avatarJpg = `https://tapbez.in/api/avatar/${slug}.jpg`;

  return {
    title,
    description,
    appleWebApp: {
      capable: true,
      title: profile.name,
      statusBarStyle: "black-translucent",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: [
        { url: avatarPng, sizes: "192x192", type: "image/png" },
        { url: avatarPng, sizes: "512x512", type: "image/png" },
        { url: "/favicon.ico" },
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: avatarPng, sizes: "180x180", type: "image/png" },
      ],
      shortcut: [avatarPng],
    },
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: "tapbez",
      images: [
        {
          url: avatarJpg,
          secureUrl: avatarJpg,
          width: 500,
          height: 500,
          type: "image/jpeg",
          alt: profile.name,
        },
      ],
    },
    twitter: {
      card: "summary", // "summary" renders square avatar on the LEFT side of text
      title,
      description,
      images: [avatarJpg],
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { src = "direct", token } = await searchParams;

  let profile = await getCachedProfile(slug);

  if (!profile && slug === "htt") {
    profile = await getCachedProfile("htt-5311");
  }

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

  const avatarPng = `https://tapbez.in/api/avatar/${slug}.png`;
  const avatarJpg = `https://tapbez.in/api/avatar/${slug}.jpg`;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{localStorage.setItem('last_profile_slug','${slug}');localStorage.setItem('installed_profile_slug','${slug}');document.cookie="last_profile_slug=${slug}; path=/; max-age=31536000; SameSite=Lax";}catch(e){}`,
        }}
      />
      <link rel="apple-touch-icon" sizes="180x180" href={avatarPng} />
      <link rel="icon" type="image/png" sizes="192x192" href={avatarPng} />
      <link rel="icon" type="image/png" sizes="512x512" href={avatarPng} />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="shortcut icon" href={avatarPng} />
      <link rel="image_src" href={avatarJpg} />
      <PublicProfileView profile={profile} sourceType={src} sourceToken={token} />
    </>
  );
}
