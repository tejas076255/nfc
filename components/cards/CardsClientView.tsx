"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Wifi,
  ExternalLink,
  Power,
  KeyRound,
  X,
  CreditCard,
} from "lucide-react";

interface CardItem {
  id: string;
  publicToken: string;
  productVariant: string;
  activationStatus: string;
  isActive: number | boolean;
  activeProfileId?: string | null;
  createdAt: number;
}

interface ProfileItem {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface CardsClientViewProps {
  initialCards: CardItem[];
  profiles: ProfileItem[];
  workspaceId: string;
}

export function CardsClientView({ initialCards, profiles }: CardsClientViewProps) {
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Claim retail card modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSecret, setClaimSecret] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const handleToggleActive = async (cardId: string, currentStatus: boolean) => {
    setActionLoadingId(cardId);
    try {
      const res = await fetch(`/api/cards/${cardId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle card active state");

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                isActive: !currentStatus,
                activationStatus: !currentStatus ? "active" : "inactive",
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

  const handleReassign = async (cardId: string, newProfileId: string) => {
    setActionLoadingId(cardId);
    try {
      const res = await fetch(`/api/cards/${cardId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: newProfileId || null }),
      });
      if (!res.ok) throw new Error("Failed to update active card profile");

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, activeProfileId: newProfileId || null } : c))
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
          profileId: selectedProfileId || null,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to claim card");

      setClaimSuccess("Card successfully activated and linked to this workspace!");
      if (data.card) {
        setCards([data.card, ...cards]);
      }
      setTimeout(() => {
        setClaimModalOpen(false);
        setClaimSecret("");
        setSelectedProfileId("");
        setClaimSuccess(null);
      }, 1500);
    } catch (err: any) {
      setClaimError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            NFC Physical Cards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your hardware cards, dynamic assignments, and instantaneous revocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setClaimModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/10 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Claim Retail Card</span>
          </button>

          <Link
            href="/orders/new"
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Order New Card</span>
          </Link>
        </div>
      </div>

      {/* Cards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <Wifi className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto rotate-90" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No Physical Cards Claimed</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven&apos;t added any physical NFC cards to this workspace yet. Order a custom card or claim one using your activation code.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setClaimModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Enter Claim Secret
              </button>
              <Link
                href="/orders/new"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Order Custom Card
              </Link>
            </div>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-5 transition-colors"
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Wifi className="w-5 h-5 rotate-90" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {card.productVariant?.replace("_", " ") || "Standard PVC"}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Token: <code className="text-blue-600 dark:text-blue-400 font-bold">{card.publicToken}</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      card.activationStatus === "active"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                    }`}
                  >
                    {card.activationStatus}
                  </span>
                </div>
              </div>

              {/* Dynamic Profile Assignment Dropdown */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Assigned Profile (Updates dynamically without chip rewrite):
                </label>
                <select
                  value={card.activeProfileId || ""}
                  onChange={(e) => handleReassign(card.id, e.target.value)}
                  disabled={actionLoadingId === card.id}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
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
              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`/t/${card.publicToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Test Redirect URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleToggleActive(card.id, Boolean(card.isActive))}
                  disabled={actionLoadingId === card.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    card.isActive
                      ? "bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
                      : "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => {
                setClaimModalOpen(false);
                setClaimError(null);
                setClaimSuccess(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Claim Physical Card</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter the one-time activation secret code included with your card package.
              </p>
            </div>

            {claimError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium">
                {claimError}
              </div>
            )}

            {claimSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                {claimSuccess}
              </div>
            )}

            <form onSubmit={handleClaimCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Activation Secret Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLAIM-8F9A-4B2C-11E2"
                  value={claimSecret}
                  onChange={(e) => setClaimSecret(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Profile (Optional)
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
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
