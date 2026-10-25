"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import { IndustryType } from "@/lib/profiles/types";
import { Sliders, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function NewProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<IndustryType>("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to create profile");

      router.push(`/dashboard/profiles/${data.id}/edit`);
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create New Digital Profile
        </h1>
        <p className="text-xs text-slate-400">
          Choose an industry template foundation. You can customize every block and theme later.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Name */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Cardholder / Business Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Siddharth Mehta or Vertex Advisory"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 6 Industry Template Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 px-1">
            Select Industry Template Family
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setIndustry(tmpl.industry)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  industry === tmpl.industry
                    ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-800"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {tmpl.industry.replace("_", " ")}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{tmpl.tagline}</p>
                  <p className="text-[11px] text-slate-400">{tmpl.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tmpl.defaultBlocks.length} curated blocks</span>
                  {industry === tmpl.industry && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? "Creating Profile..." : "Continue to Block Editor"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
