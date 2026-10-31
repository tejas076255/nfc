"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Calendar,
  Trophy,
  Users,
  Award,
  Briefcase,
  Play,
  FileDown,
  FileText,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flag,
  HelpCircle,
  Bookmark,
  CheckCircle,
  Tag,
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

function getEmbedVideoUrl(url: string): string {
  if (!url) return "";
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return url;
}

function getAvatarRadiusClass(shape?: string) {
  switch (shape?.toLowerCase()) {
    case "square":
      return "rounded-none";
    case "rounded":
    case "rounded-xl":
    case "squircle":
      return "rounded-2xl";
    case "circle":
    default:
      return "rounded-full";
  }
}

export function PublicProfileView({ profile, sourceType = "direct", sourceToken }: PublicProfileViewProps) {
  // Modal states
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<any | null>(null);

  // Form states
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [contactConsent, setContactConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Interactive controls
  const [servicesViewAll, setServicesViewAll] = useState(false);
  const [servicesSearch, setServicesSearch] = useState("");
  const [portfolioViewAll, setPortfolioViewAll] = useState(false);
  const [portfolioCategory, setPortfolioCategory] = useState<string>("all");
  const [readMoreAbout, setReadMoreAbout] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("misleading");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // PWA & Toast
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  const highlightsBlock = blocks.find((b) => b.type === "highlights" && b.isEnabled)?.blockData || {};
  const aboutBlock = blocks.find((b) => b.type === "about" && b.isEnabled)?.blockData || {};
  const servicesBlock = blocks.find((b) => b.type === "services" && b.isEnabled)?.blockData || {};
  const portfolioBlock = blocks.find((b) => b.type === "portfolio_gallery" && b.isEnabled)?.blockData || {};
  const testimonialsBlock = blocks.find((b) => b.type === "testimonials" && b.isEnabled)?.blockData || {};
  const certificationsBlock = blocks.find((b) => b.type === "certifications" && b.isEnabled)?.blockData || {};
  const introVideoBlock = blocks.find((b) => b.type === "intro_video" && b.isEnabled)?.blockData || {};
  const downloadsBlock = blocks.find((b) => b.type === "downloads" && b.isEnabled)?.blockData || {};
  const faqBlock = blocks.find((b) => b.type === "faq" && b.isEnabled)?.blockData || {};
  const beautyfolioBlock = blocks.find((b) => b.type === "beautyfolio" && b.isEnabled)?.blockData || {};
  const socialsBlock = blocks.find((b) => b.type === "social_links" && b.isEnabled)?.blockData || {};
  const locationBlock = blocks.find((b) => b.type === "location" && b.isEnabled)?.blockData || {};
  const leadFormBlock = blocks.find((b) => b.type === "lead_form" && b.isEnabled)?.blockData || {};

  // 1. Resolve Hero Portrait (Profile Photo in Background) & Centered Company Logo
  const rawCover = headerBlock.coverUrl;
  const rawAvatar = headerBlock.avatarUrl || headerBlock.photoUrl;
  const rawLogo = headerBlock.logoUrl;

  // Profile image appears in the background (hero portrait)
  const heroPortrait = rawAvatar || rawCover || null;
  // Brand/company logo appears centered over the hero portrait
  const centerLogo = rawLogo || (rawCover && rawAvatar && rawCover !== rawAvatar ? rawAvatar : null);
  const effectiveCompanyLogo = rawLogo || centerLogo || null;
  const effectiveBadge = centerLogo || heroPortrait || null;
  const experienceList: any[] = highlightsBlock.experienceTimeline || highlightsBlock.experiences || [];

  // Identity Details
  const personName = headerBlock.name || profile.name || "Cardholder";
  const professionalTitle = headerBlock.title || profile.title || "Digital Identity";
  const companyName = headerBlock.company || "";
  const businessCategory = headerBlock.category || profile.industry?.replace("_", " ") || "";
  const tagline = headerBlock.tagline || aboutBlock.headline || "";

  // 2. Resolve Highlights / Statistics (Only if explicitly configured)
  const statsList = useMemo(() => {
    if (highlightsBlock.stats && Array.isArray(highlightsBlock.stats) && highlightsBlock.stats.length > 0) {
      return highlightsBlock.stats;
    }
    return [];
  }, [highlightsBlock.stats]);

  // Socials and Links
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
    } catch { }

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
    handleTrackAction("share_profile_click");
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
    handleTrackAction("install_app_click");
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
    } catch { }
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
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setLeadSubmitted(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to submit inquiry");
    } finally {
      setLeadLoading(false);
    }
  };

  const openServiceInquiry = (serviceTitle: string) => {
    handleTrackAction("service_inquire_click");
    setServiceInterest(serviceTitle);
    setLeadModalOpen(true);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackAction("report_profile_click");
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      showToast("Thank you. Report received for review.");
    }, 2000);
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
        return "Write a Google Review";
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

  const renderStatIcon = (iconName?: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case "users":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "calendar":
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case "award":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "star":
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case "briefcase":
        return <Briefcase className="w-4 h-4 text-cyan-400" />;
      default:
        return <Clock className="w-4 h-4 text-teal-400" />;
    }
  };

  // Services filtering
  const allServices: any[] = servicesBlock.items || [];
  const filteredServices = useMemo(() => {
    if (!servicesSearch.trim()) return allServices;
    const q = servicesSearch.toLowerCase();
    return allServices.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
    );
  }, [allServices, servicesSearch]);

  const displayedServices = servicesViewAll ? filteredServices : filteredServices.slice(0, 3);

  // Portfolio items & category filtering
  const allPortfolioItems: any[] = portfolioBlock.items || [];
  const portfolioCategories = useMemo(() => {
    const cats = new Set<string>();
    allPortfolioItems.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ["all", ...Array.from(cats)];
  }, [allPortfolioItems]);

  const filteredPortfolio = useMemo(() => {
    if (portfolioCategory === "all") return allPortfolioItems;
    return allPortfolioItems.filter((i) => i.category === portfolioCategory);
  }, [allPortfolioItems, portfolioCategory]);

  const displayedPortfolio = portfolioViewAll ? filteredPortfolio : filteredPortfolio.slice(0, 4);

  // Testimonials
  const testimonials: any[] = testimonialsBlock.items || [
    {
      id: "t1",
      clientName: "Rahul Sharma",
      clientTitle: "Managing Director, Apex Dynamics",
      rating: 5,
      content:
        "Extremely professional, proactive and delivered remarkable results ahead of schedule. Truly a seamless experience working together.",
    },
    {
      id: "t2",
      clientName: "Pooja Malhotra",
      clientTitle: "Head of Marketing, Lumina Tech",
      rating: 5,
      content:
        "Outstanding expertise and precision. Handled everything with utmost clarity. Highly recommend their services to any serious business.",
    },
  ];

  // Certifications
  const certifications: any[] = certificationsBlock.items || [];

  // Downloads & Resources
  const downloads: any[] = downloadsBlock.items || [];

  // FAQs
  const faqs: any[] = faqBlock.items || [
    {
      id: "f1",
      question: "How do I save this profile or contact details?",
      answer:
        "Tap the 'Save Contact' button in the sticky action bar at the bottom of the screen. A standard .vcf contact card will download directly into your phone contacts without requiring an account.",
    },
    {
      id: "f2",
      question: "Can I book a consultation or appointment directly?",
      answer:
        "Yes! Use the 'Book Appointment' button in the quick action buttons, or use the Inquiry Form at the bottom of the screen.",
    },
    {
      id: "f3",
      question: "How does the Tapbez NFC digital card work?",
      answer:
        "Tapbez cards use encrypted contactless NFC technology. Simply tap against any modern smartphone to instantly share this complete digital profile and portfolio.",
    },
  ];

  return (
    <div
      className={`text-slate-100 flex flex-col items-center justify-start selection:bg-teal-500 selection:text-white ${sourceType === "preview" ? "min-h-full pb-28 relative" : "min-h-screen pb-28 relative"
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
        className={`w-full max-w-md shadow-2xl overflow-hidden relative flex flex-col bg-slate-950/80 backdrop-blur-xl ${sourceType === "preview"
            ? "border-0 my-0 rounded-2xl"
            : "min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl border border-white/10"
          }`}
      >
        {/* ============================================================== */}
        {/* 1. PROFILE HEADER & BRANDING                                   */}
        {/* ============================================================== */}
        <div className="relative w-full">
          {/* Hero Profile Photo in Background */}
          <div className="h-56 sm:h-64 w-full relative overflow-hidden bg-slate-900">
            {heroPortrait ? (
              <img
                src={heroPortrait}
                alt={personName}
                className="w-full h-full object-cover object-top filter brightness-95"
              />
            ) : (
              <div
                className="w-full h-full relative flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor || "#0f172a"} 0%, ${theme.accentColor || "#0d9488"} 100%)`,
                }}
              >
                {/* Geometric ambient pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-extrabold text-white shadow-xl">
                  {personName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Bottom vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent pointer-events-none" />

            {/* Brand Logo Watermark on Top Left */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white font-extrabold text-xs tracking-tight shadow-md">
              <span className="text-white">tap</span><span className="text-teal-400">bez</span>
            </div>

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

          {/* Centered Logo Badge Overlapping Hero Portrait */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 ${getAvatarRadiusClass(
                theme.avatarShape
              )} bg-white shadow-2xl border-4 border-slate-950 overflow-hidden flex items-center justify-center p-2 relative`}
              style={{
                boxShadow: `0 16px 36px -8px ${theme.accentColor || "#0d9488"}50`,
              }}
            >
              {centerLogo ? (
                <img
                  src={centerLogo}
                  alt={companyName || personName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-extrabold text-2xl shadow-inner">
                  {(companyName || personName).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identity Information Section */}
        <div
          className="px-6 pt-14 sm:pt-16 relative z-10 flex flex-col items-center text-center"
        >
          <div className="space-y-1.5 w-full">
            {/* Full Name & Verified Badge */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {personName}
              </h1>
              {headerBlock.badge && (
                <span
                  title={headerBlock.badge}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[10px] font-semibold text-teal-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{headerBlock.badge}</span>
                </span>
              )}
            </div>

            {/* Professional Designation */}
            <p className="text-sm font-semibold tracking-wide" style={{ color: theme.accentColor || "#14b8a6" }}>
              {professionalTitle}
            </p>

            {/* Short Value Proposition / Personal Quote */}
            {(headerBlock.valueProposition || (!companyName && tagline)) && (
              <p className="text-xs text-slate-300/90 pt-1.5 px-2 leading-relaxed italic text-center">
                &ldquo;{headerBlock.valueProposition || tagline}&rdquo;
              </p>
            )}
          </div>

          {/* ============================================================== */}
          {/* QUICK CONTACT BUTTONS (CALL, WA, EMAIL, MAP, BOOK)             */}
          {/* ============================================================== */}
          {(() => {
            const actions: any[] = [];
            if (contactBlock.phone) {
              actions.push({
                type: "call",
                label: "Call",
                href: `tel:${contactBlock.phone}`,
                icon: Phone,
                colorBg: "bg-blue-500/15",
                colorBorder: "border-blue-500/30",
                colorText: "text-blue-400",
                onClick: (e: any) => {
                  handleTrackAction("phone_click");
                  handleOpenExternal(e, `tel:${contactBlock.phone}`);
                },
              });
            }
            if (contactBlock.whatsapp) {
              const waUrl = resolveValidUrl(contactBlock.whatsapp, "", "whatsapp");
              actions.push({
                type: "whatsapp",
                label: "WhatsApp",
                href: waUrl || "#",
                isExternal: true,
                icon: WhatsAppIcon,
                colorBg: "bg-emerald-500/15",
                colorBorder: "border-emerald-500/30",
                colorText: "text-emerald-400",
                onClick: (e: any) => {
                  handleTrackAction("whatsapp_click");
                  handleOpenExternal(e, waUrl);
                },
              });
            }
            if (contactBlock.email) {
              actions.push({
                type: "email",
                label: "Email",
                href: `mailto:${contactBlock.email}`,
                icon: Mail,
                colorBg: "bg-purple-500/15",
                colorBorder: "border-purple-500/30",
                colorText: "text-purple-400",
                onClick: (e: any) => {
                  handleTrackAction("email_click");
                  handleOpenExternal(e, `mailto:${contactBlock.email}`);
                },
              });
            }
            if (locationBlock.mapUrl || locationBlock.address || contactBlock.location) {
              const mapUrl = locationBlock.mapUrl
                ? resolveValidUrl(locationBlock.mapUrl)
                : `https://maps.google.com/?q=${encodeURIComponent(
                    locationBlock.address || contactBlock.location || ""
                  )}`;
              actions.push({
                type: "map",
                label: "Map",
                href: mapUrl || "#",
                isExternal: true,
                icon: MapPin,
                colorBg: "bg-amber-500/15",
                colorBorder: "border-amber-500/30",
                colorText: "text-amber-400",
                onClick: (e: any) => {
                  handleTrackAction("map_click");
                  handleOpenExternal(e, mapUrl);
                },
              });
            }
            if (contactBlock.bookingUrl) {
              const bUrl = resolveValidUrl(contactBlock.bookingUrl);
              actions.push({
                type: "book",
                label: "Book",
                href: bUrl || "#",
                isExternal: true,
                icon: Calendar,
                colorBg: "bg-teal-500/15",
                colorBorder: "border-teal-500/30",
                colorText: "text-teal-400",
                onClick: (e: any) => {
                  handleTrackAction("booking_click");
                  handleOpenExternal(e, bUrl);
                },
              });
            }

            if (actions.length === 0) return null;

            const gridColsClass =
              actions.length === 1
                ? "grid-cols-1"
                : actions.length === 2
                ? "grid-cols-2"
                : actions.length === 3
                ? "grid-cols-3"
                : actions.length === 4
                ? "grid-cols-4"
                : "grid-cols-5";

            const gapClass = actions.length >= 5 ? "gap-1.5 sm:gap-2.5" : "gap-2 sm:gap-3";
            const labelSizeClass =
              actions.length >= 5
                ? "text-[10px] sm:text-[11px]"
                : actions.length === 4
                ? "text-[11px] sm:text-xs"
                : "text-xs sm:text-sm";

            return (
              <div className={`grid ${gridColsClass} ${gapClass} w-full mt-4`}>
                {actions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <a
                      key={act.type}
                      href={act.href}
                      target={act.isExternal ? "_blank" : undefined}
                      rel={act.isExternal ? "noopener noreferrer" : undefined}
                      onClick={act.onClick}
                      className="flex flex-col items-center justify-center py-2.5 px-1 sm:py-3.5 sm:px-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800/95 border border-white/10 hover:border-white/25 shadow-md active:scale-95 transition-all group cursor-pointer min-w-0"
                      title={act.label}
                    >
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${act.colorBg} border ${act.colorBorder} flex items-center justify-center ${act.colorText} shadow-xs group-hover:scale-105 transition-transform shrink-0`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      </div>
                      <span
                        className={`${labelSizeClass} font-semibold text-slate-200 mt-1.5 text-center truncate max-w-full tracking-tight group-hover:text-white transition-colors`}
                      >
                        {act.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* ============================================================== */}
        {/* MAIN BODY SECTIONS STREAM                                      */}
        {/* ============================================================== */}
        <div className="px-6 py-6 space-y-6">
          {/* ============================================================== */}
          {/* 6. SOCIAL MEDIA LINKS ("CONNECT WITH ME") & 7. GOOGLE REVIEW   */}
          {/* ============================================================== */}
          {(socialLinks.length > 0 || contactBlock.websiteUrl) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Connect With Me</span>
                </h3>
                <span className="text-[10px] text-teal-400 font-medium">Verified Channels</span>
              </div>

              {/* 7. Dedicated One-Click Google Review */}
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
                            {googleReviewLink.label || "Write a Google Review"}
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
                          Leave a 5-star review on Google in 1 tap
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

              {/* 6. Social Channels Grid */}
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

          {/* ============================================================== */}
          {/* 8. ABOUT ME / ABOUT BUSINESS                                   */}
          {/* ============================================================== */}
          {aboutBlock.bio && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-teal-400" />
                  <span>{aboutBlock.headline || "About Me"}</span>
                </h3>
              </div>

              {aboutBlock.imageUrl && (
                <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/10">
                  <img src={aboutBlock.imageUrl} alt="About" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                {readMoreAbout || aboutBlock.bio.length <= 160
                  ? aboutBlock.bio
                  : `${aboutBlock.bio.slice(0, 160)}...`}
              </p>

              {aboutBlock.bio.length > 160 && (
                <button
                  type="button"
                  onClick={() => setReadMoreAbout(!readMoreAbout)}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{readMoreAbout ? "Read Less" : "Read More"}</span>
                  {readMoreAbout ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}

              {aboutBlock.highlights && aboutBlock.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
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
          {/* CAREER EXPERIENCE & WORK HISTORY                               */}
          {/* ============================================================== */}
          {experienceList && experienceList.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  <span>Work Experience & Career</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {experienceList.length} {experienceList.length === 1 ? "Role" : "Roles"}
                </span>
              </div>

              <div className="space-y-2.5">
                {experienceList.map((exp: any, idx: number) => (
                  <div
                    key={exp.id || idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1 hover:border-teal-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {exp.role || exp.title}
                        </h4>
                        <p className="text-xs text-teal-400 font-medium truncate mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      {exp.period && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono shrink-0">
                          {exp.period}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-400 leading-relaxed pt-1 whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 9. SERVICES & PRODUCTS                                         */}
          {/* ============================================================== */}
          {allServices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Services & Products</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {allServices.length} {allServices.length === 1 ? "Offering" : "Offerings"}
                </span>
              </div>

              {/* Search bar when > 3 items */}
              {allServices.length > 3 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={servicesSearch}
                    onChange={(e) => setServicesSearch(e.target.value)}
                    placeholder="Search services or products..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-2.5">
                {displayedServices.map((svc: any) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white">{svc.title}</p>
                          {svc.duration && (
                            <span className="text-[10px] text-slate-400 font-mono">({svc.duration})</span>
                          )}
                        </div>
                        {svc.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">{svc.description}</p>
                        )}
                      </div>
                      {svc.price && (
                        <span className="text-xs font-bold text-teal-400 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 whitespace-nowrap shrink-0">
                          {svc.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[10px] text-slate-500">Fast Response</span>
                      <button
                        type="button"
                        onClick={() => openServiceInquiry(svc.title)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Enquire / Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All / Collapse toggle */}
              {allServices.length > 3 && (
                <button
                  type="button"
                  onClick={() => setServicesViewAll(!servicesViewAll)}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800/50 rounded-xl border border-white/5 transition-colors cursor-pointer text-center"
                >
                  {servicesViewAll ? "Show Less" : `View All Services (${allServices.length})`}
                </button>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 10. FEATURED WORK / PORTFOLIO                                  */}
          {/* ============================================================== */}
          {allPortfolioItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Featured Portfolio</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Selected Work</span>
              </div>

              {/* Category Filter Pills */}
              {portfolioCategories.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {portfolioCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPortfolioCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${portfolioCategory === cat
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Portfolio Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {displayedPortfolio.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveProjectModal(item)}
                    className="group rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative block hover:border-teal-500/40 transition-all cursor-pointer"
                  >
                    <div className="aspect-square w-full overflow-hidden relative bg-slate-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/80 backdrop-blur-md">
                      <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                      {item.description && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Portfolio toggle */}
              {allPortfolioItems.length > 4 && (
                <button
                  type="button"
                  onClick={() => setPortfolioViewAll(!portfolioViewAll)}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800/50 rounded-xl border border-white/5 transition-colors cursor-pointer text-center"
                >
                  {portfolioViewAll ? "Show Less" : `View All Projects (${allPortfolioItems.length})`}
                </button>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 13. INTRODUCTION VIDEO                                         */}
          {/* ============================================================== */}
          {introVideoBlock.videoUrl && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {introVideoBlock.title || "Introduction Video"}
                </h3>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                <iframe
                  src={getEmbedVideoUrl(introVideoBlock.videoUrl)}
                  title="Introduction Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {introVideoBlock.description && (
                <p className="text-xs text-slate-400">{introVideoBlock.description}</p>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 11. CLIENT TESTIMONIALS                                        */}
          {/* ============================================================== */}
          {testimonials && testimonials.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Client Testimonials</span>
                </h3>
                <span className="text-[10px] text-teal-400 font-medium">Verified Feedback</span>
              </div>

              {/* Active Testimonial Card */}
              {(() => {
                const t = testimonials[activeTestimonialIdx] || testimonials[0];
                return (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="pt-1 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center border border-teal-500/30">
                        {t.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{t.clientName}</p>
                        {t.clientTitle && <p className="text-[10px] text-slate-400">{t.clientTitle}</p>}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Navigation Indicators */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonialIdx(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${activeTestimonialIdx === idx ? "w-5 bg-teal-400" : "w-1.5 bg-white/20"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTestimonialIdx((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))
                      }
                      className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTestimonialIdx((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))
                      }
                      className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 12. CERTIFICATIONS & ACHIEVEMENTS                              */}
          {/* ============================================================== */}
          {certifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Certifications & Awards</span>
                </h3>
              </div>
              <div className="space-y-2">
                {certifications.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{c.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {c.issuer} {c.year ? `• ${c.year}` : ""}
                        </p>
                      </div>
                    </div>
                    {c.credentialUrl && (() => {
                      const cUrl = resolveValidUrl(c.credentialUrl);
                      return (
                        <a
                          href={cUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleOpenExternal(e, cUrl)}
                          className="text-xs text-teal-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 14. DOWNLOADS & RESOURCES                                      */}
          {/* ============================================================== */}
          {downloads.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5 text-teal-400" />
                  <span>Downloads & Resources</span>
                </h3>
              </div>
              <div className="space-y-2">
                {downloads.map((d: any) => {
                  const fileUrl = resolveValidUrl(d.fileUrl);
                  return (
                    <a
                      key={d.id}
                      href={fileUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleTrackAction("download_resource_click");
                        handleOpenExternal(e, fileUrl);
                      }}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 flex items-center justify-between gap-3 group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-teal-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                            {d.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {d.fileType?.toUpperCase()} {d.fileSize ? `• ${d.fileSize}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="p-1.5 rounded-lg bg-white/5 text-slate-300 group-hover:text-white shrink-0">
                        <Download className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 15. BUSINESS LOCATION & MAP                                    */}
          {/* ============================================================== */}
          {locationBlock.address && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">Business Location</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{locationBlock.address}</p>
                  {(() => {
                    const dirUrl = locationBlock.mapUrl
                      ? resolveValidUrl(locationBlock.mapUrl)
                      : `https://maps.google.com/?q=${encodeURIComponent(locationBlock.address)}`;
                    return (
                      <a
                        href={dirUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          handleTrackAction("map_click");
                          handleOpenExternal(e, dirUrl);
                        }}
                        className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
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

          {/* ============================================================== */}
          {/* 17. FREQUENTLY ASKED QUESTIONS (FAQ)                           */}
          {/* ============================================================== */}
          {faqs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Frequently Asked Questions</span>
                </h3>
              </div>
              <div className="space-y-2">
                {faqs.map((f: any, idx: number) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={f.id || idx}
                      className="rounded-xl bg-slate-900/80 border border-white/10 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3 text-left flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
                      >
                        <span>{f.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-2">
                          {f.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* 19. PROFILE FOOTER                                             */}
        {/* ============================================================== */}
        <div className="mt-auto py-6 border-t border-white/10 flex flex-col items-center justify-center text-center px-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Powered by</span>
            <Link href="/" className="font-bold text-slate-300 hover:text-teal-400 transition-colors">
              Tapbez
            </Link>
          </div>
          <p className="text-[10px] text-slate-600">
            Smart Contactless Digital Identities & NFC Solutions
          </p>
          <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={handleShareProfile}
              className="hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Flag className="w-3 h-3" />
              <span>Report Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 18. STICKY MOBILE FOOTER                                       */}
      {/* (Save Contact, Inquiry Form, Install Web App)                  */}
      {/* ============================================================== */}
      <div
        className={`${sourceType === "preview"
            ? "sticky bottom-0 left-0 right-0 z-30 p-2.5 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl"
            : "fixed bottom-0 left-0 right-0 z-40 p-3 sm:pb-4 flex justify-center pointer-events-none"
          }`}
      >
        <div
          className={`${sourceType === "preview"
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
              background: `linear-gradient(135deg, ${theme.accentColor || "#0d9488"} 0%, #2563eb 100%)`,
            }}
            title="Download vCard contact to phone"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Save Contact</span>
          </button>

          {/* Action 2: Inquiry Form */}
          <button
            type="button"
            onClick={() => {
              handleTrackAction("sticky_inquiry_click");
              setLeadModalOpen(true);
            }}
            className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer truncate"
            title="Open contact exchange form"
          >
            <Mail className="w-3.5 h-3.5 shrink-0 text-teal-400" />
            <span className="truncate">Inquiry Form</span>
          </button>

          {/* Action 3: Install Web App */}
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
      {/* MODAL 1: SHARE PROFILE                                         */}
      {/* ============================================================== */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-base font-bold text-white">Share Profile</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Share {personName}&apos;s verified digital card
                </p>
              </div>

              {/* Direct Link Copy Box */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={getPublicUrl()}
                  className="bg-transparent text-xs text-slate-300 flex-1 outline-none font-mono truncate px-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getPublicUrl());
                    setCopiedLink(true);
                    showToast("Profile link copied!");
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out ${personName}'s digital card: ${getPublicUrl()}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-600/30 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPublicUrl())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-600/30 transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 2: INSTALL WEB APP (PWA / ADD TO HOME SCREEN)            */}
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

              <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-white/20 shadow-lg bg-slate-800 flex items-center justify-center">
                {effectiveCompanyLogo || effectiveBadge ? (
                  <img src={effectiveCompanyLogo || effectiveBadge || ""} alt="App Logo" className="w-full h-full object-contain p-2 bg-white" />
                ) : (
                  <Smartphone className="w-8 h-8 text-teal-400" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Add Web App to Home Screen</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access {personName}&apos;s digital card instantly like a native app.
                </p>
              </div>

              <div className="text-left space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-white/10">
                <p className="font-semibold text-white">On iPhone (Safari):</p>
                <p className="text-slate-400">1. Tap the Share button in Safari bottom bar.</p>
                <p className="text-slate-400">2. Scroll down and tap &quot;Add to Home Screen&quot;.</p>
                <p className="font-semibold text-white pt-1">On Android (Chrome):</p>
                <p className="text-slate-400">1. Tap the three dots (menu) in top right.</p>
                <p className="text-slate-400">2. Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;.</p>
              </div>

              <button
                type="button"
                onClick={() => setInstallModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 3: INQUIRY / CONTACT EXCHANGE FORM                       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setLeadModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {leadSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">Details Exchanged!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you, {visitorName}. Your information has been shared directly with {personName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadModalOpen(false);
                      setLeadSubmitted(false);
                      setVisitorName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="w-full mt-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-3.5">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {leadFormBlock.title || "Exchange Contact Details"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {leadFormBlock.subtitle || "Share your details to connect directly."}
                    </p>
                  </div>

                  {leadError && (
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {leadError}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {allServices.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Service of Interest
                        </label>
                        <select
                          value={serviceInterest}
                          onChange={(e) => setServiceInterest(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        >
                          <option value="">General Inquiry / Networking</option>
                          {allServices.map((svc: any) => (
                            <option key={svc.id} value={svc.title}>
                              {svc.title} {svc.price ? `(${svc.price})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Brief note or inquiry..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500 resize-none"
                      />
                    </div>

                    {/* Consents */}
                    <div className="space-y-1.5 pt-1">
                      <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={contactConsent}
                          onChange={(e) => setContactConsent(e.target.checked)}
                          className="mt-0.5 rounded text-teal-500 focus:ring-0"
                        />
                        <span>I consent to share my contact information with {personName}.</span>
                      </label>

                      <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="mt-0.5 rounded text-teal-500 focus:ring-0"
                        />
                        <span>I agree to receive occasional updates or service follow-ups.</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    {leadLoading ? "Submitting..." : "Send Information"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 4: PROJECT DETAILS MODAL                                 */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-3.5"
            >
              <button
                onClick={() => setActiveProjectModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 relative">
                <img
                  src={activeProjectModal.imageUrl}
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                {activeProjectModal.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono uppercase tracking-wider">
                    {activeProjectModal.category}
                  </span>
                )}
                <h3 className="text-base font-bold text-white mt-1">{activeProjectModal.title}</h3>
                {activeProjectModal.description && (
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 whitespace-pre-line">
                    {activeProjectModal.description}
                  </p>
                )}
              </div>

              {activeProjectModal.projectUrl && (() => {
                const pUrl = resolveValidUrl(activeProjectModal.projectUrl);
                return (
                  <a
                    href={pUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenExternal(e, pUrl)}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Visit Live Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 5: REPORT PROFILE                                        */}
      {/* ============================================================== */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setReportModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2">
                  <Flag className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Report Digital Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Help maintain the integrity of verified Tapbez profiles.
                </p>
              </div>

              {reportSubmitted ? (
                <div className="text-center py-4 text-xs text-emerald-400">
                  Report submitted. Our trust & safety team will review this profile.
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value="misleading"
                        checked={reportReason === "misleading"}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-teal-500"
                      />
                      <span>Misleading or inaccurate identity</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value="spam"
                        checked={reportReason === "spam"}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-teal-500"
                      />
                      <span>Spam or unsolicited promotions</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value="copyright"
                        checked={reportReason === "copyright"}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-teal-500"
                      />
                      <span>Copyright or trademark infringement</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Report
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
