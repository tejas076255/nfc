"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FullProfileSnapshot } from "@/lib/profiles/types";
import { generateVCardString } from "@/lib/profiles/vcard";
import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Smartphone,
  Star,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PublicProfileViewProps {
  profile: FullProfileSnapshot;
  sourceType?: string;
  sourceToken?: string;
}

// Authentic SVG Branded Icons for Social Platforms & Google Reviews
function GoogleReviewIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="20" height="20" x="2" y="2" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="#E4405F" />
      <defs>
        <linearGradient id="ig-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F58529" />
          <stop offset="0.5" stopColor="#DD2A7B" />
          <stop offset="1" stopColor="#8134AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#25D366">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#229ED9">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

// Ensures links have proper protocol (https://), handles handles/numbers, and falls back to label if url was pasted into label
export function resolveValidUrl(url?: string, label?: string, platform?: string): string {
  let raw = (url || "").trim();
  const rawLabel = (label || "").trim();

  // If url is empty or "#", check if label contains a URL
  if (!raw || raw === "#") {
    if (
      rawLabel.startsWith("http://") ||
      rawLabel.startsWith("https://") ||
      rawLabel.startsWith("www.") ||
      rawLabel.includes(".com") ||
      rawLabel.includes(".in") ||
      rawLabel.includes(".me") ||
      rawLabel.includes(".org") ||
      rawLabel.includes(".io") ||
      rawLabel.includes(".be") ||
      rawLabel.includes("youtube.com") ||
      rawLabel.includes("youtu.be") ||
      rawLabel.includes("instagram.com")
    ) {
      raw = rawLabel;
    }
  }

  if (!raw || raw === "#") {
    return "";
  }

  // Prepend protocol if missing
  if (
    !raw.startsWith("http://") &&
    !raw.startsWith("https://") &&
    !raw.startsWith("mailto:") &&
    !raw.startsWith("tel:")
  ) {
    if (raw.startsWith("www.")) {
      return `https://${raw}`;
    }
    if (platform === "whatsapp") {
      const cleanDigits = raw.replace(/[^\d]/g, "");
      return `https://wa.me/${cleanDigits}`;
    }
    if (raw.startsWith("@")) {
      const handle = raw.slice(1);
      if (platform === "instagram") return `https://instagram.com/${handle}`;
      if (platform === "twitter" || platform === "x") return `https://x.com/${handle}`;
      if (platform === "youtube") return `https://youtube.com/@${handle}`;
      if (platform === "telegram") return `https://t.me/${handle}`;
      if (platform === "tiktok") return `https://tiktok.com/@${handle}`;
    }
    return `https://${raw}`;
  }

  return raw;
}

export function PublicProfileView({ profile, sourceType = "direct", sourceToken }: PublicProfileViewProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [contactConsent, setContactConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Listen for PWA install event
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleOpenExternal = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl?: string) => {
    if (!targetUrl || targetUrl === "#") {
      e.preventDefault();
      showToast("Link URL is missing. Please enter URL in Profile Editor.");
      return;
    }
    if (sourceType === "preview") {
      e.preventDefault();
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Extract blocks by type safely
  const blocks = profile.blocks || [];
  const headerBlock = blocks.find((b) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
  const contactBlock = blocks.find((b) => b.type === "contact_actions" && b.isEnabled)?.blockData || {};
  const aboutBlock = blocks.find((b) => b.type === "about" && b.isEnabled)?.blockData || {};
  const servicesBlock = blocks.find((b) => b.type === "services" && b.isEnabled)?.blockData || {};
  const portfolioBlock = blocks.find((b) => b.type === "portfolio_gallery" && b.isEnabled)?.blockData || {};
  const beautyfolioBlock = blocks.find((b) => b.type === "beautyfolio" && b.isEnabled)?.blockData || {};
  const socialsBlock = blocks.find((b) => b.type === "social_links" && b.isEnabled)?.blockData || {};
  const locationBlock = blocks.find((b) => b.type === "location" && b.isEnabled)?.blockData || {};
  const leadFormBlock = blocks.find((b) => b.type === "lead_form" && b.isEnabled)?.blockData || {};

  // 1 & 2: Resolve Person Photo & Company Logo intelligently
  let personPhoto = headerBlock.avatarUrl || headerBlock.coverUrl;
  let companyLogo = headerBlock.logoUrl;

  if (headerBlock.coverUrl && headerBlock.avatarUrl && !headerBlock.logoUrl) {
    personPhoto = headerBlock.coverUrl;
    companyLogo = headerBlock.avatarUrl;
  } else if (!personPhoto && headerBlock.coverUrl) {
    personPhoto = headerBlock.coverUrl;
  }

  // 3 & 4: Core Identity
  const personName = headerBlock.name || profile.name || "Cardholder";
  const professionalTitle = headerBlock.title || profile.title || "Digital Identity";
  const companyName = headerBlock.company || "";

  // 5: Links and Socials
  const socialLinks: any[] = socialsBlock.links || [];
  const googleReviewLink = socialLinks.find(
    (s) => s.platform === "google_review" || s.platform === "google" || s.platform?.includes("review")
  );
  const regularLinks = socialLinks.filter(
    (s) => s.platform !== "google_review" && s.platform !== "google" && !s.platform?.includes("review")
  );

  // Theme Config
  const theme = profile.themeConfig || {
    primaryColor: "#0f172a",
    accentColor: "#3b82f6",
    backgroundColor: "#07090e",
    textColor: "#f8fafc",
    cardStyle: "glass",
    avatarShape: "rounded",
  };

  const getPublicUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/p/${profile.slug}`;
    }
    return `https://nfc-business-card-saas.tejasgogavale5.workers.dev/p/${profile.slug}`;
  };

  // Actions
  const handleDownloadVCard = async () => {
    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          eventType: "save_contact_click",
          sourceToken,
          sourceType,
        }),
      });
    } catch {}

    const vCardData = generateVCardString({
      name: personName,
      title: professionalTitle,
      company: companyName,
      phone: contactBlock.phone,
      email: contactBlock.email,
      whatsapp: contactBlock.whatsapp,
      websiteUrl: contactBlock.websiteUrl,
      address: locationBlock.address || contactBlock.location,
      bio: aboutBlock.bio || profile.bio,
    });

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${personName.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Contact card (.vcf) downloaded to your phone!");
  };

  const handleShareProfile = async () => {
    const pubUrl = getPublicUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: personName,
          text: `${personName} - ${professionalTitle} ${companyName ? `(${companyName})` : ""}`,
          url: pubUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setShareModalOpen(true);
        }
      }
    } else {
      setShareModalOpen(true);
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === "accepted") {
          setDeferredPrompt(null);
          showToast("App installation started!");
        }
      });
      return;
    }
    setInstallModalOpen(true);
  };

  const handleTrackAction = (eventType: string) => {
    try {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          eventType,
          sourceToken,
          sourceType,
        }),
      });
    } catch {}
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactConsent) {
      setLeadError("Please accept the contact sharing consent.");
      return;
    }

    setLeadLoading(true);
    setLeadError(null);

    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          visitorName,
          phone,
          email: email || undefined,
          message: message || undefined,
          serviceInterest: serviceInterest || undefined,
          sourceType,
          sourceToken,
          contactConsent,
          marketingConsent,
          submissionKey: `${profile.id}-${phone}-${Date.now().toString().slice(0, -3)}`,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit lead");
      }

      setLeadSubmitted(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to submit lead");
    } finally {
      setLeadLoading(false);
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case "google_review":
      case "google":
        return <GoogleReviewIcon className="w-5 h-5 shrink-0" />;
      case "facebook":
        return <FacebookIcon className="w-5 h-5 shrink-0" />;
      case "instagram":
        return <InstagramIcon className="w-5 h-5 shrink-0" />;
      case "linkedin":
        return <LinkedInIcon className="w-5 h-5 shrink-0" />;
      case "whatsapp":
        return <WhatsAppIcon className="w-5 h-5 shrink-0" />;
      case "youtube":
        return <YouTubeIcon className="w-5 h-5 shrink-0" />;
      case "twitter":
      case "x":
        return <TwitterIcon className="w-5 h-5 shrink-0" />;
      case "telegram":
        return <TelegramIcon className="w-5 h-5 shrink-0" />;
      default:
        return <Globe className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const formatPlatformName = (platform: string) => {
    switch (platform) {
      case "google_review":
      case "google":
        return "Google Reviews";
      case "facebook":
        return "Facebook";
      case "instagram":
        return "Instagram";
      case "linkedin":
        return "LinkedIn";
      case "whatsapp":
        return "WhatsApp";
      case "youtube":
        return "YouTube";
      case "twitter":
      case "x":
        return "X (Twitter)";
      case "telegram":
        return "Telegram";
      case "website":
        return "Official Website";
      default:
        return platform.replace(/_/g, " ");
    }
  };

  return (
    <div
      className={`text-slate-100 flex flex-col items-center justify-start selection:bg-blue-500 selection:text-white ${
        sourceType === "preview" ? "min-h-full pb-28 relative" : "min-h-screen pb-28 relative"
      }`}
      style={{ backgroundColor: theme.backgroundColor || "#07090e" }}
    >
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold border border-white/20 shadow-2xl backdrop-blur-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mobile Card Container */}
      <div
        className={`w-full max-w-md shadow-2xl overflow-hidden relative flex flex-col bg-slate-950/70 backdrop-blur-xl ${
          sourceType === "preview"
            ? "border-0 my-0 rounded-2xl"
            : "min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl border border-white/10"
        }`}
      >
        {/* ============================================================== */}
        {/* 1. PROFILE PICTURE HERO & 2. LOGO BADGE                        */}
        {/* ============================================================== */}
        <div className="relative w-full">
          {/* Person's Photo (Hero) */}
          <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-900">
            {personPhoto ? (
              <img
                src={personPhoto}
                alt={personName}
                className="w-full h-full object-cover object-top filter brightness-95"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`,
                }}
              >
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-bold text-white">
                  {personName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Bottom vignette overlay for seamless blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/45 to-transparent pointer-events-none" />

            {/* Quick Share Floating Button */}
            <button
              onClick={handleShareProfile}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white transition-all shadow-lg active:scale-95 cursor-pointer"
              aria-label="Share profile"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Brand / Company Logo Badge (Centered on Seam - Square format like Image 1) */}
          {companyLogo && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-2xl border-2 border-white/90 backdrop-blur-xl flex items-center justify-center p-2.5">
                <img
                  src={companyLogo}
                  alt={companyName || "Company Logo"}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. COMPANY NAME & 4. PERSON'S NAME & TITLE                     */}
        {/* ============================================================== */}
        <div
          className={`px-6 ${
            companyLogo ? "pt-12 sm:pt-14" : "pt-4"
          } relative z-10 flex flex-col items-center text-center`}
        >
          <div className="space-y-1 w-full">
            {/* 4. Person's Name */}
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {personName}
              </h1>
              {headerBlock.badge && (
                <span title={headerBlock.badge}>
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                </span>
              )}
            </div>

            {/* Professional Title */}
            <p className="text-sm font-semibold tracking-wide" style={{ color: theme.accentColor }}>
              {professionalTitle}
            </p>

            {/* 3. Company Name (Prominent Tag/Badge) */}
            {companyName && (
              <div className="pt-1.5 flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-200 shadow-sm">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="tracking-wide">{companyName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Direct Hero CTA Buttons (Save Contact & Exchange Contact) */}
          <div className="w-full space-y-2 mt-4">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full py-3 px-4 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor || "#3b82f6"} 0%, #2563eb 100%)`,
              }}
            >
              <Download className="w-4 h-4" />
              <span>Save Contact to Phone</span>
            </button>

            <button
              type="button"
              onClick={() => setLeadModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{leadFormBlock.title || "Exchange Contact Details"}</span>
            </button>
          </div>

          {/* Quick Communication Action Grid (Call, WhatsApp, Email, Map) */}
          <div className="grid grid-cols-4 gap-2 w-full mt-3">
            {contactBlock.phone && (
              <a
                href={`tel:${contactBlock.phone}`}
                onClick={(e) => {
                  handleTrackAction("phone_click");
                  handleOpenExternal(e, `tel:${contactBlock.phone}`);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group cursor-pointer"
                title="Call phone"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-slate-300 mt-1">Call</span>
              </a>
            )}

            {contactBlock.whatsapp && (() => {
              const waUrl = resolveValidUrl(contactBlock.whatsapp, "", "whatsapp");
              return (
                <a
                  href={waUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    handleTrackAction("whatsapp_click");
                    handleOpenExternal(e, waUrl);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 mt-1">WhatsApp</span>
                </a>
              );
            })()}

            {contactBlock.email && (
              <a
                href={`mailto:${contactBlock.email}`}
                onClick={(e) => {
                  handleTrackAction("email_click");
                  handleOpenExternal(e, `mailto:${contactBlock.email}`);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group cursor-pointer"
                title="Send email"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-slate-300 mt-1">Email</span>
              </a>
            )}

            {(locationBlock.mapUrl || locationBlock.address || contactBlock.location) && (() => {
              const mapUrl = locationBlock.mapUrl
                ? resolveValidUrl(locationBlock.mapUrl)
                : `https://maps.google.com/?q=${encodeURIComponent(
                    locationBlock.address || contactBlock.location || ""
                  )}`;
              return (
                <a
                  href={mapUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    handleTrackAction("map_click");
                    handleOpenExternal(e, mapUrl);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group cursor-pointer"
                  title="Open location on Google Maps"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 mt-1">Map</span>
                </a>
              );
            })()}
          </div>
        </div>

        {/* ============================================================== */}
        {/* CONTENT STREAM: LINKS, SERVICES, PORTFOLIO                     */}
        {/* ============================================================== */}
        <div className="px-6 py-6 space-y-6">
          {/* ============================================================== */}
          {/* 5. IMPORTANT LINKS (FB, INSTA, GOOGLE REVIEW, LINKEDIN, ETC.)  */}
          {/* ============================================================== */}
          {(socialLinks.length > 0 || contactBlock.websiteUrl) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Important Links & Socials
                </h3>
                <span className="text-[10px] text-blue-400 font-medium">Verified Channels</span>
              </div>

              {/* 5A. Dedicated Google Reviews Feature Card */}
              {googleReviewLink && (() => {
                const revUrl = resolveValidUrl(googleReviewLink.url, googleReviewLink.label, "google_review");
                return (
                  <a
                    href={revUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleTrackAction("google_review_click");
                      handleOpenExternal(e, revUrl);
                    }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900/80 border border-amber-500/30 flex items-center justify-between hover:border-amber-400/60 transition-all group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                        <GoogleReviewIcon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {googleReviewLink.label || "Google Reviews"}
                          </span>
                          <div className="flex items-center text-amber-400 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400" />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Leave a 5-star review on Google
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0 ml-2">
                      <span>Review</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>
                );
              })()}

              {/* 5B. Other Important Links Grid (Facebook, Instagram, YouTube, LinkedIn, etc.) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {regularLinks.map((s: any) => {
                  const validUrl = resolveValidUrl(s.url, s.label, s.platform);
                  return (
                    <a
                      key={s.id}
                      href={validUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleTrackAction(`link_${s.platform}_click`);
                        handleOpenExternal(e, validUrl);
                      }}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-white/25 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          {renderSocialIcon(s.platform)}
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white capitalize truncate">
                          {s.label || formatPlatformName(s.platform)}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0 ml-1.5" />
                    </a>
                  );
                })}

                {/* If websiteUrl is in contactBlock and not already in socialLinks */}
                {contactBlock.websiteUrl &&
                  !socialLinks.some((l) => l.url === contactBlock.websiteUrl) && (() => {
                    const webUrl = resolveValidUrl(contactBlock.websiteUrl);
                    return (
                      <a
                        href={webUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          handleTrackAction("website_click");
                          handleOpenExternal(e, webUrl);
                        }}
                        className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-white/25 flex items-center justify-between transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                            Official Website
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0 ml-1.5" />
                      </a>
                    );
                  })()}
              </div>
            </div>
          )}

          {/* BEAUTYFOLIO SPECIALTY BADGE */}
          {beautyfolioBlock.portfolioUrl && (() => {
            const bfUrl = resolveValidUrl(beautyfolioBlock.portfolioUrl);
            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900/60 border border-rose-500/20 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                      Beautyfolio Verified
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    {beautyfolioBlock.headline || "View Verified Transformations"}
                  </p>
                  {beautyfolioBlock.featuredSpecialty && (
                    <p className="text-xs text-rose-300/80">
                      Specialty: {beautyfolioBlock.featuredSpecialty}
                    </p>
                  )}
                </div>
                <a
                  href={bfUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenExternal(e, bfUrl)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap ml-3 cursor-pointer"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })()}

          {/* ABOUT & BIOGRAPHY BLOCK */}
          {aboutBlock.bio && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
              {aboutBlock.headline && (
                <h3 className="text-sm font-semibold text-slate-200">{aboutBlock.headline}</h3>
              )}
              <p className="text-xs leading-relaxed text-slate-300">{aboutBlock.bio}</p>
              {aboutBlock.highlights && aboutBlock.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aboutBlock.highlights.map((h: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. SERVICES / PRODUCTS                                         */}
          {/* ============================================================== */}
          {servicesBlock.items && servicesBlock.items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Services & Products
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  {servicesBlock.items.length} Offerings
                </span>
              </div>
              <div className="space-y-2.5">
                {servicesBlock.items.map((svc: any) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/10 flex justify-between items-start gap-3 hover:border-white/20 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">{svc.title}</p>
                      {svc.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">{svc.description}</p>
                      )}
                    </div>
                    {svc.price && (
                      <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 whitespace-nowrap shrink-0">
                        {svc.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 7. PORTFOLIO SHOWCASE                                          */}
          {/* ============================================================== */}
          {portfolioBlock.items && portfolioBlock.items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Featured Portfolio
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">Selected Work</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {portfolioBlock.items.map((item: any) => {
                  const content = (
                    <>
                      <div className="aspect-square w-full overflow-hidden relative bg-slate-800">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.projectUrl && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-slate-950/80 backdrop-blur-md">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </>
                  );

                  const projUrl = item.projectUrl ? resolveValidUrl(item.projectUrl) : "";
                  return projUrl ? (
                    <a
                      key={item.id}
                      href={projUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleOpenExternal(e, projUrl)}
                      className="group rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative block hover:border-blue-500/40 transition-colors cursor-pointer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.id}
                      className="group rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STOREFRONT LOCATION & HOURS BLOCK */}
          {locationBlock.address && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-200">{locationBlock.address}</p>
                  {locationBlock.mapUrl && (() => {
                    const dirUrl = resolveValidUrl(locationBlock.mapUrl);
                    return (
                      <a
                        href={dirUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleOpenExternal(e, dirUrl)}
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Get Driving Directions</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    );
                  })()}
                </div>
              </div>

              {locationBlock.hours && locationBlock.hours.length > 0 && (
                <div className="border-t border-white/10 pt-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>Operating Hours</span>
                  </div>
                  {locationBlock.hours.map((h: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs text-slate-300">
                      <span>{h.day}</span>
                      <span className="font-medium text-slate-400">{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TWO-WAY LEAD EXCHANGE TRIGGER */}
          <div className="pt-2">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{leadFormBlock.title || "Exchange Contact Details"}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-1.5">
              Voluntary two-way exchange. Your details are confidential.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto py-6 border-t border-white/10 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Powered by</span>
            <Link href="/" className="font-semibold text-slate-400 hover:text-white transition-colors">
              TapSync NFC
            </Link>
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5">
            Smart Contactless NFC Business Cards & Identities
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 8. STICKY BOTTOM ACTIONS SECTION                               */}
      {/* (Save Contact, Save Profile, Install Web App)                  */}
      {/* ============================================================== */}
      <div
        className={`${
          sourceType === "preview"
            ? "sticky bottom-0 left-0 right-0 z-30 p-2.5 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl"
            : "fixed bottom-0 left-0 right-0 z-40 p-3 sm:pb-4 flex justify-center pointer-events-none"
        }`}
      >
        <div
          className={`${
            sourceType === "preview"
              ? "w-full grid grid-cols-3 gap-1.5"
              : "pointer-events-auto w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2 sm:p-2.5 grid grid-cols-3 gap-2"
          }`}
        >
          {/* Action 1: Save Contact (Direct vCard to Phone) */}
          <button
            type="button"
            onClick={handleDownloadVCard}
            className="py-2.5 px-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer truncate"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor} 0%, #2563eb 100%)`,
            }}
            title="Download vCard contact to phone"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Save Contact</span>
          </button>

          {/* Action 2: Save Profile (Share Sheet / QR) */}
          <button
            type="button"
            onClick={handleShareProfile}
            className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer truncate"
            title="Share or Save profile link"
          >
            <Share2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span className="truncate">Save Profile</span>
          </button>

          {/* Action 3: Install Web App (PWA / Add to Home Screen) */}
          <button
            type="button"
            onClick={handleInstallClick}
            className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer truncate"
            title="Install Web App on Home Screen"
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="truncate">Install App</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: INSTALL WEB APP (PWA / ADD TO HOME SCREEN)            */}
      {/* ============================================================== */}
      <AnimatePresence>
        {installModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative text-center space-y-4"
            >
              <button
                onClick={() => setInstallModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* App Icon preview */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-white/20 shadow-lg bg-slate-800 flex items-center justify-center">
                {companyLogo ? (
                  <img src={companyLogo} alt="App Logo" className="w-full h-full object-contain p-2 bg-white" />
                ) : personPhoto ? (
                  <img src={personPhoto} alt="App Icon" className="w-full h-full object-cover" />
                ) : (
                  <Smartphone className="w-8 h-8 text-blue-400" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Add Web App to Home Screen</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access {personName}&apos;s digital card instantly like a native app.
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-left space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-300">
                    Tap the <strong className="text-white">Share</strong> icon{" "}
                    <Share2 className="w-3.5 h-3.5 inline text-blue-400" /> (on iPhone Safari) or{" "}
                    <strong className="text-white">Menu (⋮)</strong> (on Android Chrome).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-300">
                    Scroll down and select <strong className="text-white">&apos;Add to Home Screen&apos;</strong> 📲.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-slate-300">
                    Tap <strong className="text-white">Add</strong>. An app icon will be saved to your device home screen!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInstallModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 2: QR & PROFILE SHARING                                  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative text-center space-y-4"
            >
              <button
                onClick={() => {
                  setShareModalOpen(false);
                  setCopiedLink(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-white">Share Business Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scan with any phone camera or copy link</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-inner inline-block mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    getPublicUrl()
                  )}`}
                  alt="Profile QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const pubUrl = getPublicUrl();
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(pubUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Profile Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 3: LEAD EXCHANGE FORM                                    */}
      {/* ============================================================== */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setLeadModalOpen(false);
                  setLeadSubmitted(false);
                  setLeadError(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {leadSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Details Sent Successfully</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Thank you, {visitorName}! Your contact details have been delivered to {personName}.
                  </p>
                  <button
                    onClick={() => setLeadModalOpen(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {leadFormBlock.title || "Exchange Contact Details"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {leadFormBlock.subtitle || "Leave your details to stay in touch."}
                    </p>
                  </div>

                  {leadError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {leadError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Priyanshu Sharma"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {leadFormBlock.services && leadFormBlock.services.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Service of Interest
                        </label>
                        <select
                          value={serviceInterest}
                          onChange={(e) => setServiceInterest(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select an inquiry topic...</option>
                          {leadFormBlock.services.map((svc: string, i: number) => (
                            <option key={i} value={svc}>
                              {svc}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Message / Note (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Brief note on what you need..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* CONSENT CHECKBOXES */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-300 leading-tight">
                      <input
                        type="checkbox"
                        checked={contactConsent}
                        onChange={(e) => setContactConsent(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 text-blue-600 focus:ring-0"
                      />
                      <span>
                        I consent to sharing my contact details with {personName} for direct business communication.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400 leading-tight">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 text-blue-600 focus:ring-0"
                      />
                      <span>
                        (Optional) I agree to receive business updates, announcements, or catalogs.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {leadLoading ? "Sending Details..." : leadFormBlock.buttonLabel || "Submit Contact Details"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
