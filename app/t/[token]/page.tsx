import React from "react";
import { redirect } from "next/navigation";
import { resolveCardRedirect } from "@/lib/cards/service";
import { logAnalyticsEvent } from "@/lib/analytics/service";
import { Wifi, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function NfcRedirectPage({ params }: PageProps) {
  const { token } = await params;
  const result = await resolveCardRedirect(token);

  if (result.status === "active" && result.profileSlug) {
    // Log NFC open event asynchronously
    if (result.workspaceId && result.profileId) {
      logAnalyticsEvent({
        workspaceId: result.workspaceId,
        profileId: result.profileId,
        eventType: "nfc_open",
        sourceToken: token,
        sourceType: "nfc",
      });
    }

    return redirect(`/p/${result.profileSlug}?src=nfc&token=${token}`);
  }

  // Handle unassigned or claimable card
  if (result.status === "claimable") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
            <Wifi className="w-8 h-8 rotate-90" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Unactivated NFC Card
            </span>
            <h1 className="text-2xl font-bold text-white pt-2">Activate Your TapSync Card</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              This physical smart card has been encoded and is ready to be linked to your digital business profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Card Token: <code className="text-blue-400 font-mono">{token}</code></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chip QA Status: Passed</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={`/cards/claim?token=${token}`}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Sign In & Claim This Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-slate-500">
              You will need your one-time activation secret found on your packaging.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle disabled or revoked card
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">Card Inactive</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {result.status === "disabled"
              ? "This NFC card has been temporarily disabled by its owner."
              : result.status === "revoked"
              ? "This card has been revoked or reported lost."
              : "This card token is invalid or has not been recognized."}
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
