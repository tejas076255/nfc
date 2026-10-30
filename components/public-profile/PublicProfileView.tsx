"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PublicProfileViewProps {
  profile: FullProfileSnapshot;
  sourceType?: string;
  sourceToken?: string;
}

export function PublicProfileView({ profile, sourceType = "direct", sourceToken }: PublicProfileViewProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Form State
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [contactConsent, setContactConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Extract blocks by type
  const headerBlock = profile.blocks.find((b) => b.type === "identity_header" && b.isEnabled)?.blockData || {};
  const contactBlock = profile.blocks.find((b) => b.type === "contact_actions" && b.isEnabled)?.blockData || {};
  const aboutBlock = profile.blocks.find((b) => b.type === "about" && b.isEnabled)?.blockData || {};
  const servicesBlock = profile.blocks.find((b) => b.type === "services" && b.isEnabled)?.blockData || {};
  const portfolioBlock = profile.blocks.find((b) => b.type === "portfolio_gallery" && b.isEnabled)?.blockData || {};
  const beautyfolioBlock = profile.blocks.find((b) => b.type === "beautyfolio" && b.isEnabled)?.blockData || {};
  const socialsBlock = profile.blocks.find((b) => b.type === "social_links" && b.isEnabled)?.blockData || {};
  const locationBlock = profile.blocks.find((b) => b.type === "location" && b.isEnabled)?.blockData || {};
  const leadFormBlock = profile.blocks.find((b) => b.type === "lead_form" && b.isEnabled)?.blockData || {};

  // Resolve Person Photo & Company Logo intelligently
  // User request: "Logo should be visible and the person photo should in place of th cover photo. no need of cover photo saperatly"
  let personPhoto = headerBlock.avatarUrl || headerBlock.coverUrl;
  let companyLogo = headerBlock.logoUrl;

  // Handle case where user uploaded company logo into avatarUrl and person photo into coverUrl
  if (headerBlock.coverUrl && headerBlock.avatarUrl && !headerBlock.logoUrl) {
    personPhoto = headerBlock.coverUrl;
    companyLogo = headerBlock.avatarUrl;
  } else if (!personPhoto && headerBlock.coverUrl) {
    personPhoto = headerBlock.coverUrl;
  }

  // Theme Config
  const theme = profile.themeConfig || {
    primaryColor: "#0f172a",
    accentColor: "#3b82f6",
    backgroundColor: "#07090e",
    textColor: "#f8fafc",
    cardStyle: "glass",
    avatarShape: "rounded",
  };

  const handleDownloadVCard = async () => {
    // Log analytics event
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
      name: headerBlock.name || profile.name,
      title: headerBlock.title || profile.title,
      company: headerBlock.company,
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
    link.setAttribute("download", `${(profile.name || "contact").replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      case "linkedin":
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case "twitter":
      case "x":
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "github":
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`text-slate-100 flex flex-col items-center justify-start selection:bg-blue-500 selection:text-white ${
        sourceType === "preview" ? "min-h-full pb-6" : "min-h-screen pb-20"
      }`}
      style={{ backgroundColor: theme.backgroundColor || "#07090e" }}
    >
      {/* Mobile Card Container */}
      <div
        className={`w-full max-w-md shadow-2xl overflow-hidden relative flex flex-col bg-slate-950/70 backdrop-blur-xl ${
          sourceType === "preview"
            ? "border-0 my-0 rounded-2xl"
            : "min-h-screen sm:min-h-0 sm:my-8 sm:rounded-3xl border border-white/10"
        }`}
      >
        {/* Main Person Photo Hero Container with Centered Logo Badge */}
        <div className="relative w-full">
          {/* Main Person Photo Hero (In place of cover photo) */}
          <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-900">
            {personPhoto ? (
              <img
                src={personPhoto}
                alt={headerBlock.name || profile.name}
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
                  {(headerBlock.name || profile.name || "U").charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Smooth bottom vignette overlay for seamless blend into card */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/45 to-transparent pointer-events-none" />

            {/* Quick Share Floating Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white transition-all shadow-lg active:scale-95 cursor-pointer"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Company / Business Logo Badge (Centered both vertically and horizontally on dividing seam) */}
          {companyLogo && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
              <div className="px-5 py-2.5 rounded-2xl bg-white shadow-2xl border-2 border-white/90 backdrop-blur-xl flex items-center justify-center gap-3 max-w-[280px]">
                <img
                  src={companyLogo}
                  alt={headerBlock.company || "Company Logo"}
                  className="h-11 sm:h-12 w-auto max-w-[180px] max-h-12 object-contain"
                />
                {headerBlock.company && (
                  <span className="text-sm font-bold text-slate-900 tracking-wide truncate max-w-[150px]">
                    {headerBlock.company}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Identity Header & Details */}
        <div className={`px-6 ${companyLogo ? "pt-10 sm:pt-11" : "pt-4"} relative z-10 flex flex-col items-center text-center`}>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {headerBlock.name || profile.name}
              </h1>
              {headerBlock.badge && (
                <span title={headerBlock.badge}>
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </span>
              )}
            </div>

            <p className="text-sm font-medium" style={{ color: theme.accentColor }}>
              {headerBlock.title || profile.title || "Digital Identity"}
            </p>

            {headerBlock.company && (
              <p className="text-xs text-slate-300 font-medium mt-1">
                {headerBlock.company}
              </p>
            )}
          </div>

          {/* PRIMARY UNCONDITIONAL SAVE CONTACT CTA */}
          <div className="w-full mt-5">
            <button
              onClick={handleDownloadVCard}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor} 0%, #2563eb 100%)`,
                boxShadow: `0 10px 25px -5px ${theme.accentColor}55`,
              }}
            >
              <Download className="w-4 h-4" />
              <span>Save Contact to Phone</span>
            </button>
          </div>

          {/* QUICK COMMUNICATION ACTION GRID */}
          <div className="grid grid-cols-4 gap-2.5 w-full mt-4">
            {contactBlock.phone && (
              <a
                href={`tel:${contactBlock.phone}`}
                onClick={() => handleTrackAction("phone_click")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-1.5">Call</span>
              </a>
            )}

            {contactBlock.whatsapp && (
              <a
                href={`https://wa.me/${contactBlock.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleTrackAction("whatsapp_click")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-1.5">WhatsApp</span>
              </a>
            )}

            {contactBlock.email && (
              <a
                href={`mailto:${contactBlock.email}`}
                onClick={() => handleTrackAction("email_click")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-1.5">Email</span>
              </a>
            )}

            {(locationBlock.mapUrl || locationBlock.address || contactBlock.location) && (
              <a
                href={
                  locationBlock.mapUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(locationBlock.address || contactBlock.location || "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-1.5">Map</span>
              </a>
            )}
          </div>
        </div>

        {/* CONTENT BLOCKS STREAM */}
        <div className="px-6 py-6 space-y-5">
          {/* BEAUTYFOLIO SPECIALTY BLOCK */}
          {beautyfolioBlock.portfolioUrl && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900/60 border border-rose-500/20 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                    Beautyfolio Verified
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {beautyfolioBlock.headline || "View Verified Beauty Transformations"}
                </p>
                {beautyfolioBlock.featuredSpecialty && (
                  <p className="text-xs text-rose-300/80">
                    Specialty: {beautyfolioBlock.featuredSpecialty}
                  </p>
                )}
              </div>
              <a
                href={beautyfolioBlock.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap ml-3"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* ABOUT & BIO BLOCK */}
          {aboutBlock.bio && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
              {aboutBlock.headline && (
                <h3 className="text-sm font-semibold text-slate-200">
                  {aboutBlock.headline}
                </h3>
              )}
              <p className="text-xs leading-relaxed text-slate-400">
                {aboutBlock.bio}
              </p>
              {aboutBlock.highlights && aboutBlock.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aboutBlock.highlights.map((h: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SERVICES MENU BLOCK */}
          {servicesBlock.items && servicesBlock.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Services & Offerings
              </h3>
              <div className="space-y-2">
                {servicesBlock.items.map((svc: any) => (
                  <div
                    key={svc.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex justify-between items-center"
                  >
                    <div className="space-y-0.5 pr-2">
                      <p className="text-sm font-semibold text-slate-200">{svc.title}</p>
                      {svc.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{svc.description}</p>
                      )}
                    </div>
                    {svc.price && (
                      <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 whitespace-nowrap">
                        {svc.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO GALLERY BLOCK */}
          {portfolioBlock.items && portfolioBlock.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Featured Portfolio
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {portfolioBlock.items.map((item: any) => {
                  const content = (
                    <>
                      <div className="aspect-square w-full overflow-hidden relative">
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
                        <p className="text-xs font-medium text-slate-200 truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                        )}
                      </div>
                    </>
                  );

                  return item.projectUrl ? (
                    <a
                      key={item.id}
                      href={item.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative block hover:border-blue-500/40 transition-colors"
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
                  {locationBlock.mapUrl && (
                    <a
                      href={locationBlock.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get Driving Directions</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
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

          {/* SOCIAL LINKS BLOCK */}
          {socialsBlock.links && socialsBlock.links.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Connect Online
              </h3>
              <div className="flex flex-wrap gap-2">
                {socialsBlock.links.map((s: any) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
                    title={s.platform}
                  >
                    {renderSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* VOLUNTARY TWO-WAY LEAD EXCHANGE TRIGGER */}
          <div className="pt-2">
            <button
              onClick={() => setLeadModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{leadFormBlock.title || "Exchange Contact Details"}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-1.5">
              Voluntary two-way exchange. Your contact details are never sold.
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
            Smart Digital Business Cards & Micro-Identities
          </p>
        </div>
      </div>

      {/* LEAD EXCHANGE MODAL */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
                    Thank you, {visitorName}! Your contact details have been delivered to {profile.name}.
                  </p>
                  <button
                    onClick={() => setLeadModalOpen(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
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

                  {/* CONSENT CHECKBOXES (PRD MANDATE: UNCHECKED MARKETING) */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-300 leading-tight">
                      <input
                        type="checkbox"
                        checked={contactConsent}
                        onChange={(e) => setContactConsent(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 text-blue-600 focus:ring-0"
                      />
                      <span>
                        I consent to sharing my contact details with {profile.name} for the purpose of direct business communication (Notice v1).
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
                        (Optional) I agree to receive marketing updates, newsletters, or seasonal announcements.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {leadLoading ? "Sending Details..." : leadFormBlock.buttonLabel || "Submit Contact Details"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR SHARING MODAL */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative text-center space-y-4"
            >
              <button
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-white">Share Business Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scan with any phone camera</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-inner inline-block mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/p/${profile.slug}`
                      : `https://nfc-business-card-saas.panchalsmit.workers.dev/p/${profile.slug}`
                  )}`}
                  alt="Profile QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const pubUrl =
                      typeof window !== "undefined"
                        ? `${window.location.origin}/p/${profile.slug}`
                        : `https://nfc-business-card-saas.panchalsmit.workers.dev/p/${profile.slug}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(pubUrl);
                      alert("Public profile URL copied to clipboard: " + pubUrl);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition-all"
                >
                  Copy Public Profile Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
