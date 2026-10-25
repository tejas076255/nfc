"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wifi, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface ClaimCardFormProps {
  profiles: any[];
  initialSecret?: string;
  initialToken?: string;
}

export function ClaimCardForm({ profiles, initialSecret = "", initialToken = "" }: ClaimCardFormProps) {
  const router = useRouter();
  const [claimSecret, setClaimSecret] = useState(initialSecret);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimSecret.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/cards/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimSecret: claimSecret.trim(),
          profileId: selectedProfileId || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Activation failed");

      setSuccess(`Card activated and linked to your workspace successfully!`);
      setTimeout(() => {
        router.push("/dashboard/cards");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to claim card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Claim Physical NFC Card
        </h1>
        <p className="text-xs text-slate-400">
          Enter your private one-time activation secret code to take ownership of this smart card.
        </p>
      </div>

      {initialToken && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Card Token:</span>
          <span className="text-blue-400 font-bold">{initialToken}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Activation Secret Code
          </label>
          <input
            type="text"
            required
            placeholder="e.g. CLAIM-8F9A-4B2C-11E2"
            value={claimSecret}
            onChange={(e) => setClaimSecret(e.target.value.toUpperCase())}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Assign to Profile (Optional)
          </label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Assign Later --</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (/p/{p.slug})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !claimSecret.trim()}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? "Activating Card..." : "Activate & Link to Workspace"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-3 border-t border-white/10 text-center">
        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
