"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, Sparkles, RefreshCw, QrCode } from "lucide-react";

interface NfcCardPreviewProps {
  name?: string;
  title?: string;
  company?: string;
  variant?: "standard_pvc" | "matte_pvc" | "custom_pvc" | "custom_metal";
  colorPalette?: string;
  metalFinish?: "champagne_gold" | "obsidian_black" | "rose_gold" | "titanium_silver";
  qrPosition?: "back_center" | "back_bottom_right";
  isInteractive?: boolean;
}

export function NfcCardPreview({
  name = "Siddharth Mehta",
  title = "Senior Corporate Counsel",
  company = "Vertex Legal Advisory",
  variant = "custom_pvc",
  colorPalette = "royal_sapphire",
  metalFinish = "champagne_gold",
  qrPosition = "back_bottom_right",
  isInteractive = true,
}: NfcCardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const isMetal = variant === "custom_metal";
  const isStandard = variant === "standard_pvc";
  const isCustomPvc = variant === "custom_pvc" || variant === "matte_pvc";

  // Palette accent styling for Customized PVC
  const getPvcAccent = () => {
    switch (colorPalette) {
      case "emerald_gold":
        return {
          primary: "#059669",
          secondary: "#10b981",
          light: "#ecfdf5",
          border: "#a7f3d0",
          text: "#065f46",
        };
      case "rose_noir":
        return {
          primary: "#e11d48",
          secondary: "#f43f5e",
          light: "#fff1f2",
          border: "#fecdd3",
          text: "#9f1239",
        };
      case "noir_gold":
        return {
          primary: "#18181b",
          secondary: "#f59e0b",
          light: "#fef3c7",
          border: "#fde68a",
          text: "#78350f",
        };
      case "royal_sapphire":
      default:
        return {
          primary: "#2563eb",
          secondary: "#3b82f6",
          light: "#eff6ff",
          border: "#bfdbfe",
          text: "#1e40af",
        };
    }
  };

  // Metal Finish Styling
  const getMetalStyle = () => {
    switch (metalFinish) {
      case "obsidian_black":
        return {
          background: "linear-gradient(115deg, #18181b 0%, #27272a 25%, #09090b 50%, #27272a 75%, #18181b 100%)",
          accentText: "#fafafa",
          subText: "#a1a1aa",
          border: "rgba(255, 255, 255, 0.15)",
          waveStroke: "#52525b",
          chip: "linear-gradient(135deg, #71717a 0%, #27272a 100%)",
          chipBorder: "rgba(255, 255, 255, 0.3)",
          badgeBg: "rgba(0, 0, 0, 0.4)",
          badgeText: "#f4f4f5",
          badgeBorder: "rgba(255, 255, 255, 0.2)",
          dropShadow: "drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]",
        };
      case "rose_gold":
        return {
          background: "linear-gradient(115deg, #c27ba0 0%, #f4c2c2 25%, #a65b82 50%, #f7d6d6 75%, #8f446d 100%)",
          accentText: "#4a152d",
          subText: "#5c223c",
          border: "rgba(74, 21, 45, 0.25)",
          waveStroke: "#78284e",
          chip: "linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)",
          chipBorder: "rgba(74, 21, 45, 0.4)",
          badgeBg: "rgba(74, 21, 45, 0.15)",
          badgeText: "#4a152d",
          badgeBorder: "rgba(74, 21, 45, 0.3)",
          dropShadow: "drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]",
        };
      case "titanium_silver":
        return {
          background: "linear-gradient(115deg, #94a3b8 0%, #f1f5f9 25%, #64748b 50%, #e2e8f0 75%, #475569 100%)",
          accentText: "#0f172a",
          subText: "#334155",
          border: "rgba(15, 23, 42, 0.25)",
          waveStroke: "#475569",
          chip: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
          chipBorder: "rgba(15, 23, 42, 0.3)",
          badgeBg: "rgba(15, 23, 42, 0.15)",
          badgeText: "#0f172a",
          badgeBorder: "rgba(15, 23, 42, 0.3)",
          dropShadow: "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]",
        };
      case "champagne_gold":
      default:
        return {
          background: "linear-gradient(115deg, #c99e32 0%, #fae58d 20%, #b88a1b 40%, #f7dc7b 60%, #9e7314 80%, #e6c55c 100%)",
          accentText: "#2d2005",
          subText: "#47340b",
          border: "rgba(71, 52, 11, 0.35)",
          waveStroke: "#664b0f",
          chip: "linear-gradient(135deg, #fef08a 0%, #ca8a04 100%)",
          chipBorder: "rgba(71, 52, 11, 0.4)",
          badgeBg: "rgba(45, 32, 5, 0.15)",
          badgeText: "#2d2005",
          badgeBorder: "rgba(71, 52, 11, 0.35)",
          dropShadow: "drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]",
        };
    }
  };

  const pvcAccent = getPvcAccent();
  const metal = getMetalStyle();

  const handleTap = () => {
    if (!isInteractive) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 1200);
  };

  const companyInitial = company?.trim() ? company.trim().charAt(0).toUpperCase() : "T";

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full max-w-[380px] h-[230px] sm:h-[240px] perspective-1000 cursor-pointer select-none group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative transform-style-3d transition-transform duration-700"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* ============================================================ */}
          {/* FRONT FACE */}
          {/* ============================================================ */}

          {/* 1. STANDARD PVC (Pure Gloss White Card) */}
          {isStandard && (
            <div className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden border border-slate-200/90 bg-gradient-to-br from-white via-[#fcfdfe] to-[#f1f5f9]">
              {/* Gloss Light Reflection Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent pointer-events-none opacity-60" />
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/[0.04] rounded-full blur-2xl pointer-events-none" />

              {/* Tap Wave Animation */}
              {isTapped && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-blue-500/15 rounded-2xl pointer-events-none"
                />
              )}

              {/* Top Row: Tapbez Brand & Badge */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Wifi className="w-4 h-4 rotate-90" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-900 block leading-none">
                      tapbez
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      NFC SMART
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs">
                  Standard PVC
                </span>
              </div>

              {/* Bottom Row: Name, Title & Company */}
              <div className="z-10 mt-auto">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-0.5 capitalize">
                  {name || "Your Full Name"}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {title || "Professional Title"}
                </p>
                {company && (
                  <p className="text-[11px] text-slate-400 mt-1 font-medium tracking-wide">
                    {company}
                  </p>
                )}
              </div>

              {/* Micro Chip Contact Pad */}
              <div className="absolute bottom-5 right-6 w-9 h-7 rounded border border-amber-400/60 bg-gradient-to-br from-amber-200/50 via-amber-300/40 to-amber-500/50 flex flex-col justify-around p-1 pointer-events-none shadow-xs">
                <div className="w-full h-px bg-amber-600/40" />
                <div className="w-full h-px bg-amber-600/40" />
              </div>
            </div>
          )}

          {/* 2. CUSTOMIZED PVC (Alex Morgan Carter Style with Modern Geometric Branding) */}
          {isCustomPvc && (
            <div className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden border border-slate-200 bg-white">
              {/* Modern Geometric Accent Ribbons (matches card-custom-pvc.jpg) */}
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 transform rotate-45 pointer-events-none transition-colors duration-300 opacity-90"
                style={{ backgroundColor: pvcAccent.primary }}
              />
              <div
                className="absolute -bottom-14 -right-1 w-28 h-28 transform rotate-45 pointer-events-none transition-colors duration-300 opacity-40"
                style={{ backgroundColor: pvcAccent.secondary }}
              />

              {/* Satin Finish Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* Tap Wave Animation */}
              {isTapped && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-2xl pointer-events-none"
                />
              )}

              {/* Top Row: Custom Corporate Monogram & NFC wave */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md transition-colors"
                    style={{ backgroundColor: pvcAccent.primary }}
                  >
                    {companyInitial}
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block leading-none">
                      {company || "tapbez"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                      EXECUTIVE ID
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs"
                    style={{
                      backgroundColor: pvcAccent.light,
                      color: pvcAccent.text,
                      borderColor: pvcAccent.border,
                    }}
                  >
                    Customized PVC
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Wifi className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Name, Title & Company */}
              <div className="z-10 mt-auto pr-16">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-0.5 capitalize">
                  {name || "Your Full Name"}
                </h3>
                <p
                  className="text-xs font-bold uppercase tracking-wider transition-colors"
                  style={{ color: pvcAccent.primary }}
                >
                  {title || "Professional Title"}
                </p>
                {company && (
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold tracking-wide">
                    {company}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. CUSTOMIZED METAL (Gold Brushed Metal Card with Laser Engraved Wavy Lines) */}
          {isMetal && (
            <div
              className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden border"
              style={{
                background: metal.background,
                borderColor: metal.border,
              }}
            >
              {/* Metallic Brushed Specular Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-white/20 to-black/10 pointer-events-none" />

              {/* Laser-Engraved Horizontal Wavy Lines (matches card-metal.jpg) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                viewBox="0 0 380 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-20 80 C 100 40, 220 120, 400 60"
                  stroke={metal.waveStroke}
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <path
                  d="M-20 95 C 100 55, 220 135, 400 75"
                  stroke={metal.waveStroke}
                  strokeWidth="1.4"
                />
                <path
                  d="M-20 110 C 100 70, 220 150, 400 90"
                  stroke={metal.waveStroke}
                  strokeWidth="1.2"
                />
                <path
                  d="M-20 125 C 100 85, 220 165, 400 105"
                  stroke={metal.waveStroke}
                  strokeWidth="1.6"
                />
                <path
                  d="M-20 140 C 100 100, 220 180, 400 120"
                  stroke={metal.waveStroke}
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                />
              </svg>

              {/* Tap Wave Animation */}
              {isTapped && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-amber-400/20 rounded-2xl pointer-events-none"
                />
              )}

              {/* Top Row: Laser-etched Contactless Emblem & Badge */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center border backdrop-blur-xs shadow-xs"
                    style={{
                      backgroundColor: metal.badgeBg,
                      borderColor: metal.badgeBorder,
                      color: metal.accentText,
                    }}
                  >
                    <Wifi className="w-4 h-4 rotate-90" />
                  </div>
                  <div>
                    <span
                      className={`text-[11px] font-black tracking-widest uppercase block leading-none ${metal.dropShadow}`}
                      style={{ color: metal.accentText }}
                    >
                      TAPBEZ METAL
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: metal.subText }}
                    >
                      LASER ENGRAVED
                    </span>
                  </div>
                </div>

                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-xs"
                  style={{
                    backgroundColor: metal.badgeBg,
                    color: metal.badgeText,
                    borderColor: metal.badgeBorder,
                  }}
                >
                  Aerospace Metal
                </span>
              </div>

              {/* Bottom Row: Laser-etched Name, Title & Company */}
              <div className="z-10 mt-auto">
                <h3
                  className={`text-xl sm:text-2xl font-black tracking-tight mb-0.5 capitalize ${metal.dropShadow}`}
                  style={{ color: metal.accentText }}
                >
                  {name || "Your Full Name"}
                </h3>
                <p
                  className={`text-xs font-black uppercase tracking-wider ${metal.dropShadow}`}
                  style={{ color: metal.subText }}
                >
                  {title || "Professional Title"}
                </p>
                {company && (
                  <p
                    className="text-[11px] font-bold mt-1 tracking-wide"
                    style={{ color: metal.subText }}
                  >
                    {company}
                  </p>
                )}
              </div>

              {/* Laser-etched Micro Contact Pad */}
              <div
                className="absolute bottom-5 right-6 w-9 h-7 rounded border flex flex-col justify-around p-1 pointer-events-none shadow-sm"
                style={{
                  background: metal.chip,
                  borderColor: metal.chipBorder,
                }}
              >
                <div className="w-full h-px opacity-40 bg-black" />
                <div className="w-full h-px opacity-40 bg-black" />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* BACK FACE (Flipped) */}
          {/* ============================================================ */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl overflow-hidden border ${
              isStandard
                ? "bg-slate-50 border-slate-200 text-slate-800"
                : isCustomPvc
                ? "bg-white border-slate-200 text-slate-800"
                : "border-amber-900/40 text-amber-950"
            }`}
            style={{
              background: isMetal ? metal.background : undefined,
              borderColor: isMetal ? metal.border : undefined,
            }}
          >
            {/* Magnetic Stripe / Signature Panel Visual Accent */}
            <div
              className={`absolute top-6 left-0 right-0 h-9 border-y ${
                isMetal ? "bg-black/60 border-black/40" : "bg-slate-900 border-slate-950"
              }`}
            />

            <div className="pt-10 flex justify-between items-center z-10">
              <div className="space-y-1">
                <p
                  className={`text-[10px] uppercase font-mono tracking-widest ${
                    isMetal ? "text-amber-950/70 font-bold" : "text-slate-400 font-semibold"
                  }`}
                >
                  Cryptographic Tap URL
                </p>
                <p
                  className={`text-xs font-mono font-bold ${
                    isMetal ? "text-amber-950" : "text-slate-900"
                  }`}
                >
                  tapbez.in/t/token...
                </p>
                <p
                  className={`text-[10px] ${
                    isMetal ? "text-amber-900/80" : "text-slate-500"
                  }`}
                >
                  Scan QR with camera or tap card with NFC phone
                </p>
              </div>

              {/* QR Code Preview Block */}
              <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
            </div>

            {/* Bottom Note */}
            <div
              className={`flex justify-between items-end text-[10px] font-mono z-10 ${
                isMetal ? "text-amber-950/60 font-semibold" : "text-slate-400"
              }`}
            >
              <span>NDEF Type 2 NFC Tag</span>
              <span>ISO 7810 ID-1 Standard</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons (Flip & Simulate Tap) */}
      {isInteractive && (
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip to {isFlipped ? "Front" : "Back"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate NFC Tap</span>
          </button>
        </div>
      )}
    </div>
  );
}
