"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Play,
  Pause,
} from "lucide-react";

export function SlashHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fix for React DOM muted bug: explicitly enforce DOM properties
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay deferred by browser policy:", err);
          setIsPlaying(false);
        });
    };

    attemptPlay();

    // User gesture fallback for browsers requiring interaction
    const handleInteraction = () => {
      if (video.paused) {
        attemptPlay();
      }
    };

    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    window.addEventListener("click", handleInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative min-h-[85dvh] sm:min-h-[90dvh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
      {/* 1. Background Video (GPU-accelerated, zero compositor blocking) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 transform-gpu will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
      >
        <source src="/product_advertisement.mp4" type="video/mp4" />
      </video>

      {/* 2. Cinematic Overlays for Perfect Contrast & 60/120fps Smoothness */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-[#030508]/80 to-[#030508]/55 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-black/45 pointer-events-none z-[1]" />

      {/* Ambient Gold Halo Glow matching the video's metallic sheen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] xs:w-[500px] sm:w-[700px] lg:w-[900px] h-[300px] sm:h-[500px] bg-amber-500/10 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none z-[1] transform-gpu" />

      {/* Play / Pause indicator button */}
      <button
        type="button"
        onClick={togglePlayback}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white text-[11px] sm:text-xs backdrop-blur-md transition-all shadow-lg group cursor-pointer"
        title={isPlaying ? "Pause background video" : "Play background video"}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Pause className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-slate-400 group-hover:text-slate-200">Video</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <Play className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-amber-300">Play Video</span>
          </>
        )}
      </button>

      {/* 3. Main Overlaid Content (Centered & Prominent) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-500/15 border border-amber-400/35 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs md:text-sm font-medium shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)] max-w-full"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
          <span className="tracking-wide truncate">Next-Gen Contactless Executive Identity</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.14] sm:leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] px-1"
        >
          The Smart NFC Card <br className="hidden xs:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            Engineered for Leaders.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal px-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        >
          Tap against any modern iPhone or Android to beam your verified executive
          credentials, services, and 1-click downloadable vCard. No app required.
          Track tap telemetry, capture leads, and update cloud data anytime.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none mx-auto"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 text-xs sm:text-sm md:text-base font-bold flex items-center justify-center gap-2 group transition-all shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)]"
            >
              <span>Order Physical Smart Card</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/register?plan=free"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-white/20 hover:border-amber-400/60 bg-black/60 hover:bg-black/75 backdrop-blur-xl text-xs sm:text-sm md:text-base text-white font-medium flex items-center justify-center gap-2 transition-all shadow-xl"
            >
              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Create Free Digital Profile</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Micro Trust Proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 pt-2 sm:pt-4 text-slate-300 font-medium"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg text-[11px] sm:text-xs md:text-sm">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Zero App Needed for Recipients</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg text-[11px] sm:text-xs md:text-sm">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Genuine NTAG213 Microchip</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg text-[11px] sm:text-xs md:text-sm">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Zero Ongoing Subscription</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
