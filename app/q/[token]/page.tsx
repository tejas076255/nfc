import React from "react";
import { redirect } from "next/navigation";
import { resolveQrRedirect } from "@/lib/qr/service";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import Link from "next/link";
import { QrCode, AlertTriangle } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function QrRedirectPage({ params }: PageProps) {
  const { token } = await params;
  const result = await resolveQrRedirect(token);

  if (result.status === "active" && result.profileSlug) {
    if (result.workspaceId && result.profileId) {
      logAnalyticsEvent({
        workspaceId: result.workspaceId,
        profileId: result.profileId,
        eventType: "qr_open",
        sourceToken: token,
        sourceType: "qr",
      });
    }

    return redirect(`/p/${result.profileSlug}?src=qr&token=${token}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">QR Code Inactive</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {result.status === "disabled"
              ? "This trackable QR code has been disabled by its owner."
              : result.status === "profile_unpublished"
              ? "The associated digital profile is currently unpublished."
              : "This QR code link is invalid or expired."}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Go to TapSync Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
