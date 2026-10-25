"use client";

import React, { useState } from "react";
import {
  QrCode,
  Download,
  Plus,
  ExternalLink,
  Power,
  Sparkles,
  Share2,
  X,
  CheckCircle2,
} from "lucide-react";

interface QrClientViewProps {
  initialQrCodes: any[];
  profiles: any[];
  workspaceId: string;
}

export function QrClientView({ initialQrCodes, profiles, workspaceId }: QrClientViewProps) {
  const [qrCodes, setQrCodes] = useState<any[]>(initialQrCodes);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || "");
  const [title, setTitle] = useState("");
  const [campaign, setCampaign] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewQrUrl, setPreviewQrUrl] = useState<string | null>(null);

  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProfileId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedProfileId,
          title: title.trim(),
          campaign: campaign.trim() || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to create QR code");

      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (qrId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/qr/${qrId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setQrCodes(
        qrCodes.map((q) => (q.id === qrId ? { ...q, isActive: !currentActive ? 1 : 0 } : q))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            QR Code Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-contrast print-ready QR codes and separately trackable campaign links.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
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
              className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Direct Profile QR
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/p/{p.slug}</span>
                </div>

                <div className="flex justify-center py-2">
                  <div className="bg-white p-3 rounded-xl shadow-inner">
                    <img src={profileQrUrl} alt="QR" className="w-36 h-36" />
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <p className="text-[11px] text-slate-400">Direct profile card scanner</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`/p/${p.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={profileQrUrl}
                  download={`qr_${p.slug}.png`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5"
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
              className="glass-card rounded-2xl p-5 border border-purple-500/20 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Trackable QR Token
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {qr.scanCount} scans
                  </span>
                </div>

                <div className="flex justify-center py-2">
                  <div className="bg-white p-3 rounded-xl shadow-inner">
                    <img src={trackableQrUrl} alt="Trackable QR" className="w-36 h-36" />
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-sm font-bold text-white">{qr.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    Target: /p/{qr.profileSlug} {qr.campaign ? `· Campaign: ${qr.campaign}` : ""}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(qr.id, Boolean(qr.isActive))}
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    qr.isActive ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{qr.isActive ? "Active" : "Disabled"}</span>
                </button>

                <a
                  href={trackableQrUrl}
                  download={`qr_token_${qr.token}.png`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white">Create Trackable QR Code</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate an independently attributable QR token (e.g. for print brochures, events, or packaging).
              </p>
            </div>

            <form onSubmit={handleCreateQr} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  QR Title / Placement Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Expo 2026 Tabletop Display"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Digital Profile
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (/p/{p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Campaign Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. conference_blr"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50"
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
