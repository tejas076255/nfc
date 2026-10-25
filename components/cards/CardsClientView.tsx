"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Wifi,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Power,
  RefreshCw,
  KeyRound,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";

interface CardsClientViewProps {
  initialCards: any[];
  profiles: any[];
  workspaceId: string;
}

export function CardsClientView({ initialCards, profiles, workspaceId }: CardsClientViewProps) {
  const [cards, setCards] = useState<any[]>(initialCards);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSecret, setClaimSecret] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleToggleActive = async (cardId: string, currentActive: boolean) => {
    setActionLoadingId(cardId);
    try {
      const res = await fetch(`/api/cards/${cardId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (!res.ok) throw new Error("Failed to update card status");

      setCards(
        cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                isActive: !currentActive ? 1 : 0,
                activationStatus: !currentActive ? "active" : "disabled",
              }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReassign = async (cardId: string, profileId: string) => {
    setActionLoadingId(cardId);
    try {
      const res = await fetch(`/api/cards/${cardId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profileId || null }),
      });
      if (!res.ok) throw new Error("Failed to reassign profile");

      const targetProfile = profiles.find((p) => p.id === profileId);
      setCards(
        cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                activeProfileId: profileId || null,
                profileName: targetProfile?.name || null,
                profileSlug: targetProfile?.slug || null,
              }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClaimCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimSecret.trim()) return;

    setClaiming(true);
    setClaimError(null);
    setClaimSuccess(null);

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
      if (!res.ok) throw new Error(data.error || "Claim verification failed");

      setClaimSuccess(`Card claimed successfully! (Token: ${data.publicToken})`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setClaimError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NFC Physical Cards
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your hardware cards, dynamic assignments, and instantaneous revocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setClaimModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Claim Retail Card</span>
          </button>

          <Link
            href="/orders/new"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Order New Card</span>
          </Link>
        </div>
      </div>

      {/* Cards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
            <Wifi className="w-10 h-10 text-slate-600 mx-auto rotate-90" />
            <p className="text-sm font-semibold text-white">No Physical Cards Claimed</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t added any physical NFC cards to this workspace yet. Order a custom card or claim one using your activation code.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setClaimModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
              >
                Enter Claim Secret
              </button>
              <Link
                href="/orders/new"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Order Custom Card
              </Link>
            </div>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="glass-card rounded-2xl p-6 border border-white/10 space-y-5"
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Wifi className="w-5 h-5 rotate-90" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white capitalize">
                      {card.productVariant?.replace("_", " ") || "Standard PVC"}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Token: <code className="text-blue-400">{card.publicToken}</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      card.activationStatus === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {card.activationStatus}
                  </span>
                </div>
              </div>

              {/* Dynamic Profile Assignment Dropdown */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Assigned Profile (Updates dynamically without chip rewrite):
                </label>
                <select
                  value={card.activeProfileId || ""}
                  onChange={(e) => handleReassign(card.id, e.target.value)}
                  disabled={actionLoadingId === card.id}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- No Profile Assigned (Shows Claim Screen) --</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status}) - /p/{p.slug}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`/t/${card.publicToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Test Redirect URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleToggleActive(card.id, Boolean(card.isActive))}
                  disabled={actionLoadingId === card.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    card.isActive
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{card.isActive ? "Disable Redirect" : "Enable Redirect"}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RETAIL CLAIM MODAL */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => {
                setClaimModalOpen(false);
                setClaimError(null);
                setClaimSuccess(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Claim Physical Card</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter the one-time activation secret code included with your card package.
              </p>
            </div>

            {claimError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {claimError}
              </div>
            )}

            {claimSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {claimSuccess}
              </div>
            )}

            <form onSubmit={handleClaimCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Activation Secret Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLAIM-8F9A-4B2C-11E2"
                  value={claimSecret}
                  onChange={(e) => setClaimSecret(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assign to Profile (Optional)
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
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
                disabled={claiming || !claimSecret.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {claiming ? "Verifying Activation Code..." : "Claim & Link Card"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
