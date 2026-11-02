"use client";

import React, { useState } from "react";
import { Plus, Download, Power, ExternalLink, X, QrCode } from "lucide-react";

interface QrItem {
  id: string;
  token: string;
  title: string;
  campaign?: string | null;
  scanCount: number;
  isActive: number | boolean;
  profileId: string;
  profileSlug?: string;
  createdAt: number;
}

interface ProfileItem {
  id: string;
  name: string;
  slug: string;
}

interface QrClientViewProps {
  initialQrCodes: QrItem[];
  profiles: ProfileItem[];
  workspaceId: string;
}

export function QrClientView({ initialQrCodes, profiles, workspaceId }: QrClientViewProps) {
  const [qrCodes, setQrCodes] = useState<QrItem[]>(initialQrCodes);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [campaign, setCampaign] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProfileId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          campaign: campaign.trim() || null,
          profileId: selectedProfileId,
          workspaceId,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to create QR code");

      const selectedProf = profiles.find((p) => p.id === selectedProfileId);
      setQrCodes([
        {
          ...data.qrCode,
          profileSlug: selectedProf?.slug,
        },
        ...qrCodes,
      ]);

      setModalOpen(false);
      setTitle("");
      setCampaign("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (qrId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/qr/${qrId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle QR status");

      setQrCodes((prev) =>
        prev.map((q) => (q.id === qrId ? { ...q, isActive: !currentStatus } : q))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            QR Code Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate high-contrast print-ready QR codes and separately trackable campaign links.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Trackable QR Link</span>
        </button>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Default Profile QR Codes */}
        {profiles.map((p) => {
          const profileQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            typeof window !== "undefined" ? `${window.location.origin}/p/${p.slug}` : `https://tapsync.com/p/${p.slug}`
          )}`;

          return (
            <div
              key={`profile_${p.id}`}
              className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    Direct Profile QR
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/p/{p.slug}</span>
                </div>

                <div className="flex justify-center py-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <img src={profileQrUrl} alt="QR" className="w-36 h-36" />
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct profile card scanner</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <a
                  href={`/p/${p.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={profileQrUrl}
                  download={`qr_${p.slug}.png`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              </div>
            </div>
          );
        })}

        {/* Separately Trackable Campaign QR Codes */}
        {qrCodes.map((qr) => {
          const trackableQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            typeof window !== "undefined" ? `${window.location.origin}/q/${qr.token}` : `https://tapsync.com/q/${qr.token}`
          )}`;

          return (
            <div
              key={qr.id}
              className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/20 shadow-xs space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                    Trackable QR Token
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {qr.scanCount} scans
                  </span>
                </div>

                <div className="flex justify-center py-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <img src={trackableQrUrl} alt="Trackable QR" className="w-36 h-36" />
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{qr.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: /p/{qr.profileSlug} {qr.campaign ? `· Campaign: ${qr.campaign}` : ""}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(qr.id, Boolean(qr.isActive))}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    qr.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{qr.isActive ? "Active" : "Disabled"}</span>
                </button>

                <a
                  href={trackableQrUrl}
                  download={`qr_token_${qr.token}.png`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE TRACKABLE QR MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Trackable QR Code</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate an independently attributable QR token (e.g. for print brochures, events, or packaging).
              </p>
            </div>

            <form onSubmit={handleCreateQr} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  QR Title / Placement Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Expo 2026 Tabletop Display"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Digital Profile
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (/p/{p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. conference_blr"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {loading ? "Generating QR..." : "Generate Trackable QR"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
