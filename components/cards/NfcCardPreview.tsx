"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, Sparkles, RefreshCw, QrCode } from "lucide-react";

interface NfcCardPreviewProps {
  name?: string;
  title?: string;
  company?: string;
  variant?: "standard_pvc" | "matte_pvc";
  colorPalette?: string;
  qrPosition?: "back_center" | "back_bottom_right";
  isInteractive?: boolean;
}

export function NfcCardPreview({
  name = "Siddharth Mehta",
  title = "Senior Corporate Counsel",
  company = "Vertex Legal Advisory",
  variant = "matte_pvc",
  colorPalette = "noir_gold",
  qrPosition = "back_bottom_right",
  isInteractive = true,
}: NfcCardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const getCardStyle = () => {
    switch (colorPalette) {
      case "emerald_gold":
        return {
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
          accent: "#10b981",
          foil: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
          border: "rgba(16, 185, 129, 0.3)",
        };
      case "rose_noir":
        return {
          background: "linear-gradient(135deg, #1c1417 0%, #2b111a 50%, #18090f 100%)",
          accent: "#f43f5e",
          foil: "linear-gradient(135deg, #fda4af 0%, #e11d48 100%)",
          border: "rgba(244, 63, 94, 0.3)",
        };
      case "royal_sapphire":
        return {
          background: "linear-gradient(135deg, #091224 0%, #172554 50%, #080d1a 100%)",
          accent: "#3b82f6",
          foil: "linear-gradient(135deg, #93c5fd 0%, #2563eb 100%)",
          border: "rgba(59, 130, 246, 0.3)",
        };
      case "noir_gold":
      default:
        return {
          background: "linear-gradient(135deg, #0b0d13 0%, #181d29 50%, #07080c 100%)",
          accent: "#f59e0b",
          foil: "linear-gradient(135deg, #fde68a 0%, #d97706 50%, #f59e0b 100%)",
          border: "rgba(245, 158, 11, 0.25)",
        };
    }
  };

  const style = getCardStyle();

  const handleTap = () => {
    if (!isInteractive) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 1200);
  };

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
          {/* FRONT FACE */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden border"
            style={{
              background: style.background,
              borderColor: style.border,
            }}
          >
            {/* Subtle Metallic Foil Texture */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

            {/* Tap Wave Animation */}
            {isTapped && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-blue-500/20 rounded-2xl pointer-events-none"
              />
            )}

            {/* Top Row: NFC Icon and Company */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Wifi className="w-5 h-5 text-white/90 rotate-90" />
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
                  TapSync NFC
                </span>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 backdrop-blur-md">
                {variant === "matte_pvc" ? "Matte Luxe" : "Gloss PVC"}
              </span>
            </div>

            {/* Bottom Row: Name, Title, and Company */}
            <div className="z-10 mt-auto">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
                {name || "Your Full Name"}
              </h3>
              <p
                className="text-sm font-medium tracking-wide uppercase text-transparent bg-clip-text"
                style={{ backgroundImage: style.foil }}
              >
                {title || "Professional Title"}
              </p>
              {company && (
                <p className="text-xs text-white/50 mt-1 font-normal tracking-wide">
                  {company}
                </p>
              )}
            </div>

            {/* Micro chip icon */}
            <div className="absolute bottom-5 right-6 w-9 h-7 rounded border border-amber-400/40 bg-gradient-to-br from-amber-300/20 to-amber-600/20 flex flex-col justify-around p-1 pointer-events-none opacity-80">
              <div className="w-full h-px bg-amber-300/40" />
              <div className="w-full h-px bg-amber-300/40" />
            </div>
          </div>

          {/* BACK FACE */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl overflow-hidden border"
            style={{
              background: style.background,
              borderColor: style.border,
            }}
          >
            {/* Magnetic Stripe / Signature Panel Visual Accent */}
            <div className="absolute top-6 left-0 right-0 h-9 bg-black/60 border-y border-white/10" />

            <div className="pt-10 flex justify-between items-center z-10">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                  Secured Redirect Token
                </p>
                <p className="text-xs font-mono text-white/70">
                  tapsync.com/t/c_7x9a...
                </p>
              </div>

              {/* QR Code Preview Block */}
              <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
            </div>

            {/* Bottom Note */}
            <div className="flex justify-between items-end text-[10px] text-white/40 font-mono z-10">
              <span>NDEF NFC Type 2 Tag</span>
              <span>ISO 7810 ID-1 Standard</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      {isInteractive && (
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate NFC Tap</span>
          </button>
        </div>
      )}
    </div>
  );
}
