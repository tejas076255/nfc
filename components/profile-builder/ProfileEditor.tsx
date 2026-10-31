"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FullProfileSnapshot, IndustryType, ProfileBlockItem } from "@/lib/profiles/types";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import { PublicProfileView } from "../public-profile/PublicProfileView";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Share2,
  Copy,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Trash2,
  Edit2,
  Plus,
  X,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Users,
  Trophy,
  Star,
  FileText,
  Download,
  GripVertical,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Layers,
  Sparkles,
  Award,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Tag,
  Link as LinkIcon,
  Eye,
  CheckSquare,
  Square,
} from "lucide-react";
import { compressImageFile } from "@/lib/utils/image";

interface ProfileEditorProps {
  initialProfile: any;
  workspaceId: string;
}

export function ProfileEditor({ initialProfile, workspaceId }: ProfileEditorProps) {
  const [profile, setProfile] = useState<any>(initialProfile);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [planLimitError, setPlanLimitError] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [portfolioTab, setPortfolioTab] = useState<"images" | "videos" | "mix">("images");

  // Smooth scroll to card anchors based on window.location.hash
  useEffect(() => {
    const scrollToCurrentHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const targetId = window.location.hash.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const timer = setTimeout(scrollToCurrentHash, 150);
    window.addEventListener("hashchange", scrollToCurrentHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToCurrentHash);
    };
  }, []);

  const switchTemplateFamily = (industryKey: IndustryType) => {
    const tmpl = INDUSTRY_TEMPLATES[industryKey];
    if (!tmpl) return;

    setProfile((prev: any) => ({
      ...prev,
      industry: industryKey,
      templateId: tmpl.id,
      themeConfig: {
        ...(prev.themeConfig || {}),
        accentColor: tmpl.defaultTheme.accentColor,
        backgroundColor: tmpl.defaultTheme.backgroundColor,
        textColor: tmpl.defaultTheme.textColor,
        avatarShape: tmpl.defaultTheme.avatarShape || prev.themeConfig?.avatarShape || "circle",
      },
    }));
    setSaveMessage(`Applied ${tmpl.name} styling.`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const updateAccentColor = (hex: string) => {
    setProfile((prev: any) => ({
      ...prev,
      themeConfig: {
        ...(prev.themeConfig || {}),
        accentColor: hex,
      },
    }));
  };

  const updateAvatarShape = (shape: "circle" | "rounded" | "square") => {
    setProfile((prev: any) => ({
      ...prev,
      themeConfig: {
        ...(prev.themeConfig || {}),
        avatarShape: shape,
      },
    }));
  };

  // Inline inputs state
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState("instagram");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Blocks accessor
  const blocks: ProfileBlockItem[] = profile.blocks || [];

  const getBlock = (type: string): any => {
    return blocks.find((b) => b.type === type) || { isEnabled: true, blockData: {} as any };
  };

  const isBlockEnabled = (blockType: string): boolean => {
    const found = blocks.find((b) => b.type === blockType);
    return found ? Boolean(found.isEnabled) : true;
  };

  const toggleBlockEnabled = (blockType: string) => {
    let exists = false;
    const updated = blocks.map((b) => {
      if (b.type === blockType) {
        exists = true;
        return { ...b, isEnabled: !b.isEnabled };
      }
      return b;
    });
    if (!exists) {
      updated.push({
        id: `b_${blockType}_${Date.now()}`,
        type: blockType as any,
        isEnabled: false,
        sortOrder: updated.length,
        blockData: {},
      });
    }
    setProfile({ ...profile, blocks: updated });
  };

  const updateBlockData = (blockType: string, newBlockData: Record<string, any>) => {
    let exists = false;
    const updated = blocks.map((b) => {
      if (b.type === blockType) {
        exists = true;
        return { ...b, blockData: { ...b.blockData, ...newBlockData } };
      }
      return b;
    });
    if (!exists) {
      updated.push({
        id: `b_${blockType}_${Date.now()}`,
        type: blockType as any,
        isEnabled: true,
        sortOrder: updated.length,
        blockData: newBlockData,
      });
    }
    setProfile({ ...profile, blocks: updated });
  };

  // Image Upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatarUrl" | "coverUrl" | "logoUrl" | "aboutImageUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setErrorMessage(null);
    try {
      const maxWidth = field === "coverUrl" ? 1440 : 800;
      const maxHeight = field === "coverUrl" ? 500 : 800;
      const dataUrl = await compressImageFile(file, { maxWidth, maxHeight, quality: 0.85 });

      if (field === "aboutImageUrl") {
        updateBlockData("about", { imageUrl: dataUrl });
      } else {
        updateBlockData("identity_header", { [field]: dataUrl });
      }
      setSaveMessage("Image uploaded successfully! Remember to Save Draft or Publish.");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process image file.");
    } finally {
      setUploadingField(null);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setPlanLimitError(false);

    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          slug: profile.slug,
          title: profile.title,
          bio: profile.bio,
          industry: profile.industry,
          templateId: profile.templateId,
          themeConfig: profile.themeConfig,
          blocks: profile.blocks,
          searchIndexed: Boolean(profile.searchIndexed),
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      setSaveMessage("Draft saved successfully to Cloudflare D1.");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMessage(null);
    setPlanLimitError(false);

    try {
      await handleSaveDraft();

      const res = await fetch(`/api/profiles/${profile.id}/publish`, {
        method: "POST",
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        if (res.status === 403 && data.code === "PLAN_LIMIT_EXCEEDED") {
          setPlanLimitError(true);
          throw new Error(data.error || "Plan published profiles limit reached.");
        }
        throw new Error(data.error || "Failed to publish profile");
      }

      setProfile({ ...profile, status: "published" });
      setSaveMessage("✨ Profile published live successfully!");
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("Are you sure you want to unpublish this profile? It will no longer be visible publicly.")) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/profiles/${profile.id}/unpublish`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to unpublish profile");
      }
      setProfile({ ...profile, status: "draft" });
      setSaveMessage("Profile unpublished and set to draft.");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getPublicUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/p/${profile.slug}`;
    }
    return `https://tapbez.in/${profile.slug}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPublicUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Block data convenience references
  const headerBlock: any = getBlock("identity_header").blockData || {};
  const contactBlock: any = getBlock("contact_actions").blockData || {};
  const highlightsBlock: any = getBlock("highlights").blockData || {};
  const aboutBlock: any = getBlock("about").blockData || {};
  const socialsBlock: any = getBlock("social_links").blockData || {};
  const servicesBlock: any = getBlock("services").blockData || {};
  const portfolioBlock: any = getBlock("portfolio_gallery").blockData || {};
  const testimonialsBlock: any = getBlock("testimonials").blockData || {};
  const locationBlock: any = getBlock("location").blockData || {};
  const leadFormBlock: any = getBlock("lead_form").blockData || {};
  const downloadsBlock: any = getBlock("downloads").blockData || {};

  // Resolved social links
  const socialLinks: any[] = socialsBlock.links || [
    { id: "s1", platform: "instagram", url: "https://instagram.com/rikesh.jp", isEnabled: true },
    { id: "s2", platform: "facebook", url: "https://facebook.com/rikesh.jp", isEnabled: true },
    { id: "s3", platform: "youtube", url: "https://youtube.com/@rikesh.jp", isEnabled: true },
    { id: "s4", platform: "linkedin", url: "https://www.linkedin.com/in/rikesh.jp", isEnabled: true },
    { id: "s5", platform: "google_review", url: "https://g.page/r/your-google-review", isEnabled: true },
    { id: "s6", platform: "website", url: "https://upmark.in", isEnabled: true },
  ];

  // Resolved stats
  const statsList: any[] = highlightsBlock.stats || [
    { id: "st1", label: "Years of Experience", value: "20+", icon: "briefcase" },
    { id: "st2", label: "Clients / Students", value: "500+", icon: "users" },
    { id: "st3", label: "Title / Founder Year", value: "2018", icon: "calendar" },
  ];

  // Resolved experiences / stats
  const experiencesStats: any[] = [
    { id: "exp1", label: "Years Experience", value: "20+", icon: "briefcase" },
    { id: "exp2", label: "Clients & Students", value: "500+", icon: "users" },
    { id: "exp3", label: "Projects Completed", value: "1000+", icon: "trophy" },
    { id: "exp4", label: "Client Rating", value: "4.9 ★", icon: "star" },
  ];

  // Resolved about tags
  const aboutTags: string[] = aboutBlock.highlights || ["Training", "Consulting", "AI Solutions", "Business Growth"];

  // Resolved services
  const servicesList: any[] = servicesBlock.items || [
    { id: "srv1", title: "Digital Marketing Training", description: "Beginner to Advanced Practical Training", price: "₹ 45,000", isEnabled: true },
    { id: "srv2", title: "AI SEO Services", description: "Grow Organically with AI & SEO", price: "₹ 15,000", isEnabled: true },
    { id: "srv3", title: "NFC Cards", description: "Smart Digital Business Cards", price: "₹ 999", isEnabled: true },
    { id: "srv4", title: "Social Media Management", description: "Strategy, Content & Growth", price: "₹ 12,000", isEnabled: true },
    { id: "srv5", title: "Website Development", description: "Business & Portfolio Websites", price: "₹ 25,000", isEnabled: true },
  ];

  // Resolved portfolio
  const portfolioList: any[] = portfolioBlock.items || [
    { id: "p1", title: "Website Project", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80" },
    { id: "p2", title: "Social Media Campaign", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80" },
    { id: "p3", title: "NFC Card Design", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80" },
    { id: "p4", title: "Event Coverage", imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80" },
    { id: "p5", title: "Branding Design", imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80" },
  ];

  // Resolved testimonials
  const testimonialsList: any[] = testimonialsBlock.items || [
    {
      id: "t1",
      clientName: "Neha Shah",
      clientTitle: "Salon Owner",
      rating: 5,
      content: "Excellent training with practical knowledge. Helped me grow my business.",
    },
  ];

  // Resolved downloads
  const downloadsList: any[] = downloadsBlock.items || [
    { id: "d1", title: "Company Profile", fileSize: "PDF • 2 MB", fileUrl: "#" },
    { id: "d2", title: "Training Brochure", fileSize: "PDF • 1.5 MB", fileUrl: "#" },
    { id: "d3", title: "Service Menu", fileSize: "PDF • 1.2 MB", fileUrl: "#" },
  ];

  // Quick Action Buttons definitions
  const quickActionsConfig = [
    { id: "vcard", label: "Save Contact to Phone (vCard)", icon: Download, isEnabled: true },
    { id: "call", label: "Call", icon: Phone, isEnabled: Boolean(contactBlock.phone), value: contactBlock.phone || "+91 98250 12345", field: "phone" },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, isEnabled: Boolean(contactBlock.whatsapp), value: contactBlock.whatsapp || "+919825012345", field: "whatsapp" },
    { id: "email", label: "Email", icon: Mail, isEnabled: Boolean(contactBlock.email), value: contactBlock.email || "hello@upmark.in", field: "email" },
    { id: "map", label: "Map / Location", icon: MapPin, isEnabled: Boolean(locationBlock.address || contactBlock.location), value: locationBlock.address || "Surat, Gujarat, India", field: "location" },
    { id: "book", label: "Book Appointment", icon: Calendar, isEnabled: Boolean(contactBlock.bookingUrl), value: contactBlock.bookingUrl || "https://calendly.com", field: "bookingUrl" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f4f7fc] text-slate-800">
      {/* ============================================================== */}
      {/* 1. TOP HEADER BAR                                              */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Edit Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all your profile content, sections and settings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Public Profile Link Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 max-w-[240px] sm:max-w-[320px]">
            <span className="truncate">{getPublicUrl()}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* View Live Profile Button */}
          <Link
            href={`/p/${profile.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Live Profile</span>
          </Link>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* Publish Button (Prominent Blue) */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>

          {/* 3-dots More Actions */}
          <button
            type="button"
            onClick={handleUnpublish}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Unpublish or more options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {saveMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-800 font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {planLimitError && (
            <Link
              href="/dashboard/billing"
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      )}

      {/* MOBILE SWITCHER TAB (Only visible on small screens) */}
      <div className="md:hidden flex border-b border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mobileTab === "editor" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
            }`}
        >
          Section Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mobileTab === "preview" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
            }`}
        >
          Live Simulator
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE: 3-COLUMN SECTIONS GRID + RIGHT LIVE SIMULATOR */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT/CENTER: 3-COLUMN MASONRY GRID OF CARDS */}
        <div
          className={`flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto ${mobileTab === "editor" ? "block" : "hidden md:block"
            }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 items-start">
            {/* ========================================================== */}
            {/* COLUMN 1: CARDS 1, 4, 6, 8                                 */}
            {/* ========================================================== */}
            <div className="space-y-6">
              {/* CARD 1: PROFILE HEADER */}
              <div id="profile-header" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Profile Header</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("identity_header")}
                      onChange={() => toggleBlockEnabled("identity_header")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Cover & Profile Logo Upload Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Cover Image / Banner */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <span className="block text-xs font-semibold text-slate-700">Cover Image / Banner</span>
                    <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                      {headerBlock.coverUrl ? (
                        <img
                          src={headerBlock.coverUrl}
                          alt="Cover Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                          <span className="text-[10px]">No banner set</span>
                        </div>
                      )}
                      <label className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-black text-white cursor-pointer shadow-md transition-all active:scale-95">
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "coverUrl")}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400">Recommended: 1440 × 400 px</p>
                  </div>

                  {/* Profile Logo (in circle) */}
                  <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
                    <span className="block text-xs font-semibold text-slate-700">Profile Logo (in circle)</span>
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden relative flex items-center justify-center p-1 group">
                      {headerBlock.logoUrl || headerBlock.avatarUrl ? (
                        <img
                          src={headerBlock.logoUrl || headerBlock.avatarUrl}
                          alt="Logo"
                          className="w-full h-full object-contain rounded-full"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-teal-600" />
                      )}
                      <label className="absolute bottom-0 right-1 p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md transition-all active:scale-95">
                        <Camera className="w-3 h-3" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "logoUrl")}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400">Recommended: 500 × 500 px</p>
                  </div>
                </div>

                {/* Name & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={headerBlock.name ?? profile.name ?? ""}
                      onChange={(e) => {
                        setProfile({ ...profile, name: e.target.value });
                        updateBlockData("identity_header", { name: e.target.value });
                      }}
                      placeholder="e.g. Rikesh Panchal"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      value={headerBlock.title ?? profile.title ?? ""}
                      onChange={(e) => {
                        setProfile({ ...profile, title: e.target.value });
                        updateBlockData("identity_header", { title: e.target.value });
                      }}
                      placeholder="e.g. Founder • Trainer • Consultant"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Company Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={headerBlock.company || ""}
                      onChange={(e) => updateBlockData("identity_header", { company: e.target.value })}
                      placeholder="e.g. Upmark Digital"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Tagline</label>
                    <input
                      type="text"
                      value={headerBlock.tagline || ""}
                      onChange={(e) => updateBlockData("identity_header", { tagline: e.target.value })}
                      placeholder="e.g. Digital Marketing | Training | Consulting"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Short Value Proposition */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Short Value Proposition</label>
                    <span className="text-[10px] text-slate-400">
                      {(headerBlock.valueProposition || "").length}/120
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={120}
                    value={headerBlock.valueProposition || ""}
                    onChange={(e) => updateBlockData("identity_header", { valueProposition: e.target.value })}
                    placeholder="Helping businesses grow with Digital Marketing, AI and practical training."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* CARD 4: SOCIAL MEDIA LINKS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      4
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Social Media Links</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("social_links")}
                      onChange={() => toggleBlockEnabled("social_links")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Add your social media links. Icons will show on your profile.
                </p>

                {/* Social Links List */}
                <div className="space-y-2.5">
                  {socialLinks.map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5"
                    >
                      <span className="text-xs font-bold text-slate-700 capitalize w-24 truncate shrink-0">
                        {link.platform.replace("_", " ")}
                      </span>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          updateBlockData("social_links", { links: updated });
                        }}
                        placeholder={`https://${link.platform}.com/...`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:outline-none min-w-0"
                      />
                      <input
                        type="checkbox"
                        checked={link.isEnabled !== false}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[idx] = { ...updated[idx], isEnabled: e.target.checked };
                          updateBlockData("social_links", { links: updated });
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 shrink-0 cursor-pointer"
                        title="Show on profile"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = socialLinks.filter((_, i) => i !== idx);
                          updateBlockData("social_links", { links: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 shrink-0 cursor-pointer"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Social Link Toggle */}
                {showAddSocialModal ? (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedSocialPlatform}
                        onChange={(e) => setSelectedSocialPlatform(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="google_review">Google Review</option>
                        <option value="website">Official Website</option>
                        <option value="twitter">X (Twitter)</option>
                        <option value="whatsapp">WhatsApp Channel</option>
                        <option value="telegram">Telegram</option>
                      </select>
                      <input
                        type="url"
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSocialModal(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSocialUrl.trim()) return;
                          const updated = [
                            ...socialLinks,
                            {
                              id: `soc_${Date.now()}`,
                              platform: selectedSocialPlatform,
                              url: newSocialUrl.trim(),
                              isEnabled: true,
                            },
                          ];
                          updateBlockData("social_links", { links: updated });
                          setNewSocialUrl("");
                          setShowAddSocialModal(false);
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddSocialModal(true)}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Social Link</span>
                  </button>
                )}
              </div>

              {/* CARD 6: EXPERIENCES / STATS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      6
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Experiences / Stats</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("experiences_stats")}
                      onChange={() => toggleBlockEnabled("experiences_stats")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* 4 Stat Boxes in 2x2 Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {experiencesStats.map((st, i) => (
                    <div
                      key={st.id || i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-1"
                    >
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-0.5">
                        {st.icon === "briefcase" && <Briefcase className="w-3.5 h-3.5" />}
                        {st.icon === "users" && <Users className="w-3.5 h-3.5" />}
                        {st.icon === "trophy" && <Trophy className="w-3.5 h-3.5" />}
                        {st.icon === "star" && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">{st.value}</span>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 8: FEATURED WORK / PORTFOLIO */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      8
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Featured Work / Portfolio</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("portfolio_gallery")}
                      onChange={() => toggleBlockEnabled("portfolio_gallery")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Filter Tabs & Add Project Button */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    {(["images", "videos", "mix"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPortfolioTab(t)}
                        className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${portfolioTab === t ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newTitle = prompt("Enter Project Title:");
                      if (!newTitle) return;
                      const updated = [
                        ...portfolioList,
                        {
                          id: `p_${Date.now()}`,
                          title: newTitle,
                          imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80",
                        },
                      ];
                      updateBlockData("portfolio_gallery", { items: updated });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Horizontal Scroll of Project Cards */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {portfolioList.map((p, i) => (
                    <div
                      key={p.id || i}
                      className="w-36 shrink-0 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative group"
                    >
                      <div className="h-20 bg-slate-200 overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{p.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = portfolioList.filter((_, idx) => idx !== i);
                          updateBlockData("portfolio_gallery", { items: updated });
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* COLUMN 2: CARDS 2, 5, 7                                    */}
            {/* ========================================================== */}
            <div className="space-y-6">
              {/* CARD 2: QUICK INFO / HIGHLIGHTS */}
              <div id="sections" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Quick Info / Highlights</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("highlights")}
                      onChange={() => toggleBlockEnabled("highlights")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* 3 Stat Boxes Side by Side */}
                <div className="grid grid-cols-3 gap-2.5">
                  {statsList.map((stat, i) => (
                    <div
                      key={stat.id || i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-1"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-0.5">
                        {stat.icon === "briefcase" && <Briefcase className="w-4 h-4" />}
                        {stat.icon === "users" && <Users className="w-4 h-4" />}
                        {stat.icon === "calendar" && <Calendar className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight">
                        {stat.label}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 5: ABOUT ME */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      5
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">About Me</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("about")}
                      onChange={() => toggleBlockEnabled("about")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* 2-Column: About Image + About Description */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-semibold text-slate-700">About Image</span>
                    <div className="h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center group">
                      {aboutBlock.imageUrl ? (
                        <img src={aboutBlock.imageUrl} alt="About" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                      <label className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white cursor-pointer shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "aboutImageUrl")}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400">Recommended: 800 × 600 px</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-semibold text-slate-700">About Description</span>
                      <span className="text-[10px] text-slate-400">
                        {(aboutBlock.bio || "").length}/500
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={aboutBlock.bio || ""}
                      onChange={(e) => updateBlockData("about", { bio: e.target.value })}
                      placeholder="I'm a Digital Marketing Trainer, Consultant and Founder of Upmark. I help businesses and professionals grow through practical digital strategies, AI tools and real-world implementation."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Key Skills / Tags */}
                <div className="pt-1 space-y-2">
                  <span className="block text-xs font-semibold text-slate-700">Key Skills / Tags</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {aboutTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = aboutTags.filter((_, i) => i !== idx);
                            updateBlockData("about", { highlights: updated });
                          }}
                          className="hover:text-red-500 text-slate-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {showTagInput ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTagInput.trim()) {
                              const updated = [...aboutTags, newTagInput.trim()];
                              updateBlockData("about", { highlights: updated });
                              setNewTagInput("");
                              setShowTagInput(false);
                            }
                          }}
                          placeholder="Type tag & Enter"
                          className="px-2 py-0.5 rounded-full border border-blue-400 text-xs text-slate-800 w-28 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowTagInput(true)}
                        className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
                      >
                        + Add Tag
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 7: SERVICES & PRODUCTS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      7
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Services & Products</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("services")}
                      onChange={() => toggleBlockEnabled("services")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const title = prompt("Enter Service Title:");
                      if (!title) return;
                      const price = prompt("Enter Price (e.g. ₹ 45,000):") || "₹ 0";
                      const updated = [
                        ...servicesList,
                        {
                          id: `srv_${Date.now()}`,
                          title,
                          description: "Professional Service Offering",
                          price,
                          isEnabled: true,
                        },
                      ];
                      updateBlockData("services", { items: updated });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service / Product</span>
                  </button>
                </div>

                {/* Services List */}
                <div className="space-y-2.5">
                  {servicesList.map((srv, idx) => (
                    <div
                      key={srv.id || idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-teal-600/15 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{srv.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{srv.description}</p>
                          <span className="text-[11px] font-extrabold text-blue-600">{srv.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="checkbox"
                          checked={srv.isEnabled !== false}
                          onChange={(e) => {
                            const updated = [...servicesList];
                            updated[idx] = { ...updated[idx], isEnabled: e.target.checked };
                            updateBlockData("services", { items: updated });
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                          title="Toggle visibility"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = servicesList.filter((_, i) => i !== idx);
                            updateBlockData("services", { items: updated });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* COLUMN 3: CARDS 3, 9, 10, 11, 12                           */}
            {/* ========================================================== */}
            <div className="space-y-6">
              {/* CARD 3: QUICK ACTION BUTTONS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      3
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Quick Action Buttons</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("contact_actions")}
                      onChange={() => toggleBlockEnabled("contact_actions")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {quickActionsConfig.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 truncate">{act.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={act.isEnabled}
                          onChange={(e) => {
                            if (act.field) {
                              updateBlockData("contact_actions", {
                                [act.field]: e.target.checked ? act.value : "",
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 shrink-0 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD 9: CLIENT TESTIMONIALS */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      9
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Client Testimonials</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("testimonials")}
                      onChange={() => toggleBlockEnabled("testimonials")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const clientName = prompt("Enter Client Name:");
                      if (!clientName) return;
                      const content = prompt("Enter Testimonial Review:") || "Great experience!";
                      const updated = [
                        ...testimonialsList,
                        {
                          id: `t_${Date.now()}`,
                          clientName,
                          clientTitle: "Verified Client",
                          rating: 5,
                          content,
                        },
                      ];
                      updateBlockData("testimonials", { items: updated });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                {testimonialsList.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {t.clientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                        {"★".repeat(t.rating || 5)}
                      </div>
                      <p className="text-xs text-slate-700 italic leading-snug line-clamp-2">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <p className="text-[11px] font-bold text-slate-900 mt-1">
                        {t.clientName} <span className="text-slate-400 font-normal">• {t.clientTitle}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = testimonialsList.filter((_, i) => i !== idx);
                        updateBlockData("testimonials", { items: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* CARD 10: LOCATION & CONTACT FORM */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      10
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Location & Contact Form</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("location")}
                      onChange={() => toggleBlockEnabled("location")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Map Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="block text-xs font-semibold text-slate-700">Google Map</span>
                    <div className="h-20 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center p-2">
                      <MapPin className="w-4 h-4 text-red-500 mb-0.5" />
                      <span className="text-[11px] font-bold text-slate-800">
                        {locationBlock.address || "Surat, Gujarat, India"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newAddress = prompt("Enter City / Address:", locationBlock.address || "");
                        if (newAddress) updateBlockData("location", { address: newAddress });
                      }}
                      className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Get Directions
                    </button>
                  </div>

                  {/* Contact Form Fields */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="block text-xs font-semibold text-slate-700">Contact Form Fields</span>
                    <div className="space-y-1 text-xs text-slate-700">
                      <label className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Name</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Phone Number</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Email Address</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Your Message</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 11: DOWNLOADS & RESOURCES */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      11
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Downloads & Resources</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("downloads")}
                      onChange={() => toggleBlockEnabled("downloads")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {downloadsList.map((dl, i) => (
                    <div
                      key={dl.id || i}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {dl.title} <span className="text-[10px] text-slate-400 font-normal">({dl.fileSize})</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = downloadsList.filter((_, idx) => idx !== i);
                            updateBlockData("downloads", { items: updated });
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 12: ADDITIONAL SETTINGS */}
              <div id="settings" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      12
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Additional Settings</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={isBlockEnabled("additional_settings")}
                      onChange={() => toggleBlockEnabled("additional_settings")}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Quick Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Certifications", icon: Award },
                    { label: "Events", icon: Calendar },
                    { label: "Blog / Latest Posts", icon: FileText },
                    { label: "FAQ", icon: HelpCircle },
                    { label: "Team Members", icon: Users },
                    { label: "Custom Section", icon: Sparkles },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSaveMessage(`Opened ${item.label} settings.`);
                          setTimeout(() => setSaveMessage(null), 2500);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* APPEARANCE & INDUSTRY TEMPLATES */}
              <div id="appearance" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 scroll-mt-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                    🎨
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Choose Industry Template Family</h2>
                    <p className="text-[11px] text-slate-500">
                      Switching template updates visual styling and accents while preserving all your entered content.
                    </p>
                  </div>
                </div>

                {/* 6 Industry Template Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: "professional", name: "Executive Suite", desc: "Corporate, Legal & Advisory", color: "#2563eb" },
                    { key: "bridal_beauty", name: "Luxury Atelier", desc: "Bridal, Makeup, Hair & Wellness", color: "#e11d48" },
                    { key: "real_estate", name: "Architectural Horizon", desc: "Luxury Properties & Developments", color: "#059669" },
                    { key: "portfolio_agency", name: "Neo Gallery", desc: "Design, Photography & Art Direction", color: "#6366f1" },
                    { key: "local_biz", name: "Cornerstone Local", desc: "Cafés, Clinics, Boutiques & Services", color: "#d97706" },
                    { key: "creator", name: "Pulse Creator", desc: "Influencers, Streamers & Podcasters", color: "#a855f7" },
                  ].map((tmpl) => {
                    const isSelected = profile.industry === tmpl.key;
                    return (
                      <div
                        key={tmpl.key}
                        onClick={() => switchTemplateFamily(tmpl.key as IndustryType)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-slate-900 text-white border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                            : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {tmpl.name}
                          </p>
                          <p className={`text-[10px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                            {tmpl.desc}
                          </p>
                        </div>
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white/20"
                          style={{ backgroundColor: tmpl.color }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Visual Customization: Accent Color & Avatar Shape */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800">Visual Customization</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Accent Color Hex */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Accent Color Hex</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={profile.themeConfig?.accentColor || "#2563eb"}
                          onChange={(e) => updateAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-200 p-0.5 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={profile.themeConfig?.accentColor || "#2563eb"}
                          onChange={(e) => updateAccentColor(e.target.value)}
                          placeholder="#2563eb"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Avatar Shape */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Avatar Shape</label>
                      <select
                        value={profile.themeConfig?.avatarShape || "circle"}
                        onChange={(e) => updateAvatarShape(e.target.value as any)}
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="circle">Circle</option>
                        <option value="rounded">Rounded Square</option>
                        <option value="square">Sharp Square</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO & SHARING */}
              <div id="seo" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      🔍
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">SEO & Social Sharing Preview</h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-500 font-medium">Index on Google</span>
                    <input
                      type="checkbox"
                      checked={Boolean(profile.searchIndexed)}
                      onChange={(e) => setProfile({ ...profile, searchIndexed: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Google Search Result Preview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Google Search Preview</span>
                  <p className="text-xs text-emerald-700 font-mono truncate">
                    https://tapbez.in/p/{profile.slug}
                  </p>
                  <p className="text-sm font-semibold text-blue-700 truncate hover:underline cursor-pointer">
                    {profile.name} — {profile.title || "Digital Business Profile"} | Tapbez
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {profile.bio || `Connect with ${profile.name}. View digital business card, services, social links, portfolio, and contact details on Tapbez.`}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Custom Meta Title</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Custom Meta Description</label>
                    <textarea
                      rows={2}
                      value={profile.bio || ""}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Brief description for search engines and social cards..."
                      className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: REALISTIC LIVE PREVIEW (MOBILE SIMULATOR)       */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-[410px] lg:w-[440px] shrink-0 bg-[#0d121f] border-l border-slate-800 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto ${mobileTab === "preview" ? "flex" : "hidden md:flex"
            }`}
        >
          <div className="w-full max-w-sm sticky top-4">
            {/* Simulator Device Switcher */}
            <div className="flex items-center justify-between text-xs text-slate-300 mb-3 px-1">
              <span className="flex items-center gap-1.5 font-bold text-white text-sm">
                <span>Live Preview (Mobile)</span>
              </span>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* REALISTIC SMARTPHONE BEZEL FRAME */}
            <div className="rounded-[44px] p-2.5 sm:p-3 bg-slate-950 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden w-full">
              {/* iPhone Top Notch / Speaker Slit */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black z-30 flex items-center justify-center">
                <div className="w-10 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Status Bar: Time & Indicators */}
              <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-white/90 z-20 relative select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Mobile Viewport */}
              <div className="w-full rounded-[30px] overflow-hidden max-h-[82vh] sm:max-h-[720px] overflow-y-auto scrollbar-none">
                <PublicProfileView
                  profile={{
                    id: profile.id,
                    slug: profile.slug,
                    name: profile.name,
                    title: profile.title,
                    bio: profile.bio,
                    industry: profile.industry,
                    templateId: profile.templateId,
                    themeConfig: profile.themeConfig,
                    blocks: profile.blocks,
                    searchIndexed: Boolean(profile.searchIndexed),
                  }}
                  sourceType="preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
