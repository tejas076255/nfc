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
  ChevronLeft,
  ChevronRight,
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

  // Onboarding vs Grid View State
  const [viewMode, setViewMode] = useState<"onboarding" | "grid">("onboarding");
  const [currentStep, setCurrentStep] = useState(1);

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

  // Sync hash to onboarding steps
  useEffect(() => {
    const syncHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const h = window.location.hash.toLowerCase();
        if (h.includes("header") || h === "#1") setCurrentStep(1);
        else if (h.includes("action") || h.includes("sections") || h === "#2") setCurrentStep(2);
        else if (h.includes("social") || h === "#3") setCurrentStep(3);
        else if (h.includes("about") || h.includes("highlights") || h === "#4") setCurrentStep(4);
        else if (h.includes("service") || h === "#5") setCurrentStep(5);
        else if (h.includes("portfolio") || h.includes("work") || h === "#6") setCurrentStep(6);
        else if (h.includes("testimonial") || h.includes("location") || h === "#7") setCurrentStep(7);
        else if (h.includes("appearance") || h.includes("theme") || h.includes("settings") || h.includes("seo") || h === "#8") setCurrentStep(8);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    const stepHashes: Record<number, string> = {
      1: "header",
      2: "sections",
      3: "socials",
      4: "about",
      5: "services",
      6: "portfolio",
      7: "testimonials",
      8: "appearance",
    };
    if (typeof window !== "undefined") {
      window.location.hash = stepHashes[stepNumber] || `${stepNumber}`;
    }
  };

  // Industry Template & Appearance helpers
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

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(targetField);
    try {
      const compressedBase64 = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });

      if (targetField === "avatarUrl") {
        updateBlockData("identity_header", { avatarUrl: compressedBase64 });
      } else if (targetField === "coverUrl") {
        updateBlockData("identity_header", { coverUrl: compressedBase64 });
      } else if (targetField === "aboutImageUrl") {
        updateBlockData("about", { imageUrl: compressedBase64 });
      } else if (targetField === "companyLogoUrl") {
        updateBlockData("identity_header", { logoUrl: compressedBase64 });
      }
      setSaveMessage("Image uploaded successfully.");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process image.");
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

  const STEPS = [
    { id: 1, label: "Header & Identity", short: "Header", icon: "👤", desc: "Avatar, banner, name, role & brand logo" },
    { id: 2, label: "Action Buttons", short: "Actions", icon: "⚡", desc: "Direct call, WhatsApp, email & map directions" },
    { id: 3, label: "Social Links", short: "Socials", icon: "🔗", desc: "Instagram, YouTube, LinkedIn & web channels" },
    { id: 4, label: "About & Stats", short: "About", icon: "📝", desc: "Bio narrative, skill tags & experience numbers" },
    { id: 5, label: "Services & Products", short: "Services", icon: "💼", desc: "Service packages, pricing & descriptions" },
    { id: 6, label: "Featured Portfolio", short: "Portfolio", icon: "🎨", desc: "Project gallery, photos & video media" },
    { id: 7, label: "Reviews & Map", short: "Reviews", icon: "⭐", desc: "Client testimonials & Google Map location" },
    { id: 8, label: "Theme, SEO & Files", short: "Theme & SEO", icon: "✨", desc: "Industry templates, colors, PDFs & SEO" },
  ];

  // =========================================================================
  // SECTION RENDERERS
  // =========================================================================

  // SECTION 1: PROFILE HEADER & IDENTITY
  const renderHeaderSection = (isFullWidth = false) => (
    <div id="profile-header" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            1
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Profile Header & Branding</h2>
            <p className="text-xs text-slate-500">Upload your banner, photo, and set your identity.</p>
          </div>
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

      {/* Cover Banner Upload */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">Cover Banner (1440 × 400 px recommended)</label>
        <div className="h-36 sm:h-44 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
          {headerBlock.coverUrl ? (
            <img src={headerBlock.coverUrl} alt="Cover Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5 bg-slate-50">
              <ImageIcon className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-medium">No cover banner set</span>
            </div>
          )}
          <label className="absolute bottom-3 right-3 px-3 py-2 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-lg transition-all flex items-center gap-1.5 active:scale-95">
            <Camera className="w-4 h-4" />
            <span>{uploadingField === "coverUrl" ? "Uploading..." : "Change Banner"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverUrl")} />
          </label>
        </div>
      </div>

      {/* Avatar & Logo Two-Col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profile Avatar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 relative border-2 border-white shadow-sm">
            {headerBlock.avatarUrl ? (
              <img src={headerBlock.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg bg-teal-50 text-teal-600">
                {profile.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-slate-800">Profile Portrait</span>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-xs">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>{uploadingField === "avatarUrl" ? "Uploading..." : "Upload Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatarUrl")} />
            </label>
          </div>
        </div>

        {/* Company Logo */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 relative border-2 border-white shadow-sm flex items-center justify-center">
            {headerBlock.logoUrl ? (
              <img src={headerBlock.logoUrl} alt="Company Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Building2 className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="space-y-1">
            <span className="block text-xs font-bold text-slate-800">Company Logo</span>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-xs">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>{uploadingField === "companyLogoUrl" ? "Uploading..." : "Upload Logo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "companyLogoUrl")} />
            </label>
          </div>
        </div>
      </div>

      {/* Form Fields: Spacious 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Full Name *</label>
          <input
            type="text"
            required
            value={headerBlock.name !== undefined ? headerBlock.name : profile.name}
            onChange={(e) => {
              updateBlockData("identity_header", { name: e.target.value });
              setProfile({ ...profile, name: e.target.value });
            }}
            placeholder="e.g. Rikesh Panchal"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Designation / Role *</label>
          <input
            type="text"
            value={headerBlock.title !== undefined ? headerBlock.title : profile.title || ""}
            onChange={(e) => {
              updateBlockData("identity_header", { title: e.target.value });
              setProfile({ ...profile, title: e.target.value });
            }}
            placeholder="e.g. Founder • Trainer • Consultant"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Company / Brand Name</label>
          <input
            type="text"
            value={headerBlock.company || ""}
            onChange={(e) => updateBlockData("identity_header", { company: e.target.value })}
            placeholder="e.g. Upmark Digital"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Company Tagline / Subtitle</label>
          <input
            type="text"
            value={headerBlock.badge || ""}
            onChange={(e) => updateBlockData("identity_header", { badge: e.target.value })}
            placeholder="e.g. Digital Marketing | Training | Consulting"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Short Value Proposition / Bio Quote</label>
          <textarea
            rows={2}
            value={headerBlock.valueProposition || ""}
            onChange={(e) => updateBlockData("identity_header", { valueProposition: e.target.value })}
            placeholder="Helping businesses grow with Digital Marketing, AI and practical training..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium resize-none"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Public Profile Link Slug</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 shrink-0">
              tapbez.in/p/
            </span>
            <input
              type="text"
              value={profile.slug || ""}
              onChange={(e) => setProfile({ ...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
              placeholder="your-unique-slug"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // SECTION 2: QUICK ACTION BUTTONS & CONTACT
  const renderQuickActionsSection = () => (
    <div id="sections" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            2
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Quick Action Buttons & Contact Info</h2>
            <p className="text-xs text-slate-500">Configure phone call, WhatsApp, email, map, and meeting booking links.</p>
          </div>
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

      <div className="space-y-4">
        {/* Direct Call Phone */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Direct Phone Call</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(contactBlock.phone)}
              onChange={(e) => updateBlockData("contact_actions", { phone: e.target.checked ? (contactBlock.phone || "+91 98250 12345") : "" })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </div>
          <input
            type="tel"
            value={contactBlock.phone || ""}
            onChange={(e) => updateBlockData("contact_actions", { phone: e.target.value })}
            placeholder="+91 98250 12345"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* WhatsApp Chat */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">WhatsApp Chat</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(contactBlock.whatsapp)}
              onChange={(e) => updateBlockData("contact_actions", { whatsapp: e.target.checked ? (contactBlock.whatsapp || "+919825012345") : "" })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </div>
          <input
            type="tel"
            value={contactBlock.whatsapp || ""}
            onChange={(e) => updateBlockData("contact_actions", { whatsapp: e.target.value })}
            placeholder="+91 98250 12345 or full URL"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Email Address</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(contactBlock.email)}
              onChange={(e) => updateBlockData("contact_actions", { email: e.target.checked ? (contactBlock.email || "hello@upmark.in") : "" })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </div>
          <input
            type="email"
            value={contactBlock.email || ""}
            onChange={(e) => updateBlockData("contact_actions", { email: e.target.value })}
            placeholder="hello@yourbrand.com"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Map / Location */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Map / Office Address</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(locationBlock.address || contactBlock.location)}
              onChange={(e) => {
                const val = e.target.checked ? (locationBlock.address || "Surat, Gujarat, India") : "";
                updateBlockData("location", { address: val });
                updateBlockData("contact_actions", { location: val });
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={locationBlock.address || contactBlock.location || ""}
            onChange={(e) => {
              updateBlockData("location", { address: e.target.value });
              updateBlockData("contact_actions", { location: e.target.value });
            }}
            placeholder="e.g. Ring Road, Surat, Gujarat, India"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Book Appointment */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Appointment / Calendly Link</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(contactBlock.bookingUrl)}
              onChange={(e) => updateBlockData("contact_actions", { bookingUrl: e.target.checked ? (contactBlock.bookingUrl || "https://calendly.com") : "" })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </div>
          <input
            type="url"
            value={contactBlock.bookingUrl || ""}
            onChange={(e) => updateBlockData("contact_actions", { bookingUrl: e.target.value })}
            placeholder="https://calendly.com/your-username"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  // SECTION 3: SOCIAL MEDIA LINKS
  const renderSocialsSection = () => (
    <div id="socials" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            3
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Social Media & Important Links</h2>
            <p className="text-xs text-slate-500">Add verified handles for Instagram, YouTube, LinkedIn, Google Review, etc.</p>
          </div>
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

      {/* Quick Add Social Row */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <span className="block text-xs font-bold text-slate-800">Add New Social or Custom Link</span>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={selectedSocialPlatform}
            onChange={(e) => setSelectedSocialPlatform(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="google_review">Google Review</option>
            <option value="website">Website</option>
            <option value="twitter">Twitter / X</option>
            <option value="telegram">Telegram</option>
            <option value="tiktok">TikTok</option>
          </select>
          <input
            type="text"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
            placeholder="https://instagram.com/your-username"
            className="w-full flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              if (!newSocialUrl.trim()) return;
              const newItem = {
                id: `soc_${Date.now()}`,
                platform: selectedSocialPlatform,
                url: newSocialUrl.trim(),
                isEnabled: true,
              };
              updateBlockData("social_links", { links: [...socialLinks, newItem] });
              setNewSocialUrl("");
              setSaveMessage("Link added successfully.");
              setTimeout(() => setSaveMessage(null), 2000);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Active Links List */}
      <div className="space-y-2.5">
        {socialLinks.map((link, idx) => (
          <div
            key={link.id || idx}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-700 capitalize shrink-0 w-24 truncate">
                {link.platform.replace("_", " ")}
              </span>
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[idx] = { ...updated[idx], url: e.target.value };
                  updateBlockData("social_links", { links: updated });
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="checkbox"
                checked={link.isEnabled !== false}
                onChange={(e) => {
                  const updated = [...socialLinks];
                  updated[idx] = { ...updated[idx], isEnabled: e.target.checked };
                  updateBlockData("social_links", { links: updated });
                }}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                title="Toggle visibility"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = socialLinks.filter((_, i) => i !== idx);
                  updateBlockData("social_links", { links: updated });
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // SECTION 4: ABOUT ME & HIGHLIGHTS
  const renderAboutAndStatsSection = () => (
    <div id="about" className="space-y-6">
      {/* Card 4A: About Me */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              4
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">About Me & Bio Narrative</h2>
              <p className="text-xs text-slate-500">Your professional background, credentials and skill tags.</p>
            </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* About Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">About Photo (800 × 600 px)</label>
            <div className="h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group flex items-center justify-center">
              {aboutBlock.imageUrl ? (
                <img src={aboutBlock.imageUrl} alt="About portrait" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span className="text-xs">No image set</span>
                </div>
              )}
              <label className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/75 hover:bg-black text-white cursor-pointer shadow-md transition-all active:scale-95">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "aboutImageUrl")} />
              </label>
            </div>
          </div>

          {/* About Description */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">About Description</label>
              <span className="text-[10px] text-slate-400 font-mono">{(aboutBlock.content || profile.bio || "").length} / 500</span>
            </div>
            <textarea
              rows={6}
              value={aboutBlock.content !== undefined ? aboutBlock.content : profile.bio || ""}
              onChange={(e) => {
                updateBlockData("about", { content: e.target.value });
                setProfile({ ...profile, bio: e.target.value });
              }}
              placeholder="I'm a Digital Marketing Trainer, Consultant and Founder. I help businesses grow with practical digital strategies, AI tools and real-world implementation..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Key Skills / Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">Key Skills & Specializations</label>
          <div className="flex flex-wrap items-center gap-2">
            {aboutTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = aboutTags.filter((_, i) => i !== idx);
                    updateBlockData("about", { highlights: updated });
                  }}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {showTagInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTagInput.trim()) {
                      e.preventDefault();
                      updateBlockData("about", { highlights: [...aboutTags, newTagInput.trim()] });
                      setNewTagInput("");
                      setShowTagInput(false);
                    }
                  }}
                  placeholder="Type tag & Enter"
                  className="px-2.5 py-1 text-xs rounded-xl border border-blue-500 bg-white text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowTagInput(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="px-3 py-1.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card 4B: Experience & Stats Numbers */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              📊
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Experience Highlights & Numbers</h2>
              <p className="text-xs text-slate-500">Display impressive milestones (years of experience, clients, founded year).</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {experiencesStats.map((exp, idx) => (
            <div key={exp.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <input
                type="text"
                value={exp.value}
                onChange={(e) => {
                  const updated = [...experiencesStats];
                  updated[idx] = { ...updated[idx], value: e.target.value };
                  updateBlockData("highlights", { stats: updated });
                }}
                className="w-full text-center text-lg font-black text-slate-900 bg-transparent focus:outline-none"
              />
              <input
                type="text"
                value={exp.label}
                onChange={(e) => {
                  const updated = [...experiencesStats];
                  updated[idx] = { ...updated[idx], label: e.target.value };
                  updateBlockData("highlights", { stats: updated });
                }}
                className="w-full text-center text-[11px] font-semibold text-slate-500 bg-transparent focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // SECTION 5: SERVICES & PRODUCTS
  const renderServicesSection = () => (
    <div id="services" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            5
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Services & Products</h2>
            <p className="text-xs text-slate-500">Showcase your offerings, consulting packages, and digital solutions.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const newItem = {
              id: `srv_${Date.now()}`,
              title: "New Service Offering",
              description: "High impact consulting and execution",
              price: "₹ 10,000",
              isEnabled: true,
            };
            updateBlockData("services", { items: [...servicesList, newItem] });
            setSaveMessage("Service added. Edit title and price below.");
            setTimeout(() => setSaveMessage(null), 2500);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="space-y-3">
        {servicesList.map((srv, idx) => (
          <div
            key={srv.id || idx}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <input
                  type="text"
                  value={srv.title}
                  onChange={(e) => {
                    const updated = [...servicesList];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    updateBlockData("services", { items: updated });
                  }}
                  className="w-full text-sm font-bold text-slate-900 bg-transparent focus:outline-none focus:bg-white rounded-md px-1"
                />
                <input
                  type="text"
                  value={srv.description}
                  onChange={(e) => {
                    const updated = [...servicesList];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    updateBlockData("services", { items: updated });
                  }}
                  className="w-full text-xs text-slate-500 bg-transparent focus:outline-none focus:bg-white rounded-md px-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              <input
                type="text"
                value={srv.price}
                onChange={(e) => {
                  const updated = [...servicesList];
                  updated[idx] = { ...updated[idx], price: e.target.value };
                  updateBlockData("services", { items: updated });
                }}
                className="w-28 text-right font-black text-blue-600 text-sm bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              />
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
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // SECTION 6: FEATURED WORK & PORTFOLIO
  const renderPortfolioSection = () => (
    <div id="portfolio" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            6
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Featured Work & Portfolio Gallery</h2>
            <p className="text-xs text-slate-500">Display project images, case studies, or campaign designs.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const newItem = {
              id: `p_${Date.now()}`,
              title: "New Featured Project",
              imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80",
            };
            updateBlockData("portfolio_gallery", { items: [...portfolioList, newItem] });
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {portfolioList.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group space-y-2">
            <div className="h-32 bg-slate-200 overflow-hidden relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <button
                type="button"
                onClick={() => {
                  const updated = portfolioList.filter((_, i) => i !== idx);
                  updateBlockData("portfolio_gallery", { items: updated });
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2.5">
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = [...portfolioList];
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  updateBlockData("portfolio_gallery", { items: updated });
                }}
                className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // SECTION 7: TESTIMONIALS & LOCATION MAP
  const renderTestimonialsAndMapSection = () => (
    <div id="testimonials" className="space-y-6">
      {/* Testimonials */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              7
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Client Testimonials & Reviews</h2>
              <p className="text-xs text-slate-500">Build social proof with authentic client reviews and 5-star ratings.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newItem = {
                id: `t_${Date.now()}`,
                clientName: "Happy Client",
                clientTitle: "Business Director",
                rating: 5,
                content: "Outstanding results and communication. Highly recommended!",
              };
              updateBlockData("testimonials", { items: [...testimonialsList, newItem] });
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>

        <div className="space-y-3">
          {testimonialsList.map((t, idx) => (
            <div key={t.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-700 font-bold text-xs flex items-center justify-center">
                    {t.clientName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={t.clientName}
                      onChange={(e) => {
                        const updated = [...testimonialsList];
                        updated[idx] = { ...updated[idx], clientName: e.target.value };
                        updateBlockData("testimonials", { items: updated });
                      }}
                      className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    />
                    <input
                      type="text"
                      value={t.clientTitle}
                      onChange={(e) => {
                        const updated = [...testimonialsList];
                        updated[idx] = { ...updated[idx], clientTitle: e.target.value };
                        updateBlockData("testimonials", { items: updated });
                      }}
                      className="block text-[10px] text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = testimonialsList.filter((_, i) => i !== idx);
                    updateBlockData("testimonials", { items: updated });
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={2}
                value={t.content}
                onChange={(e) => {
                  const updated = [...testimonialsList];
                  updated[idx] = { ...updated[idx], content: e.target.value };
                  updateBlockData("testimonials", { items: updated });
                }}
                className="w-full text-xs text-slate-700 bg-transparent border-t border-slate-200/80 pt-2 focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Google Map & Contact Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Google Map Location & Direction Card</h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">{locationBlock.address || "Surat, Gujarat, India"}</p>
              <p className="text-[10px] text-slate-500">Live directions pin shown on public business card</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newAddress = prompt("Enter Office City / Address:", locationBlock.address || "");
              if (newAddress) updateBlockData("location", { address: newAddress });
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
          >
            Update Address
          </button>
        </div>
      </div>
    </div>
  );

  // SECTION 8: APPEARANCE, THEME, DOWNLOADS & SEO
  const renderAppearanceAndSeoSection = () => (
    <div id="appearance" className="space-y-6">
      {/* 6 Industry Template Families */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            🎨
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Choose Industry Template Family</h2>
            <p className="text-xs text-slate-500">Switching template updates visual styling and accents while preserving all your content.</p>
          </div>
        </div>

        {/* 6 Template Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white border-blue-500 shadow-md ring-2 ring-blue-500"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="min-w-0 pr-3">
                  <p className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {tmpl.name}
                  </p>
                  <p className={`text-xs truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {tmpl.desc}
                  </p>
                </div>
                <div
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs border-2 border-white/40"
                  style={{ backgroundColor: tmpl.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Visual Customization */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Visual Customization</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Accent Color Hex</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={profile.themeConfig?.accentColor || "#2563eb"}
                  onChange={(e) => updateAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={profile.themeConfig?.accentColor || "#2563eb"}
                  onChange={(e) => updateAccentColor(e.target.value)}
                  placeholder="#2563eb"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Avatar Shape</label>
              <select
                value={profile.themeConfig?.avatarShape || "circle"}
                onChange={(e) => updateAvatarShape(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="circle">Circle</option>
                <option value="rounded">Rounded Square</option>
                <option value="square">Sharp Square</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Search Engine Preview */}
      <div id="seo" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              🔍
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">SEO & Google Search Preview</h2>
              <p className="text-xs text-slate-500">Control how your digital card appears when shared on WhatsApp and Google.</p>
            </div>
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

        {/* Google Snippet Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Google Result Snippet</span>
          <p className="text-xs text-emerald-700 font-mono truncate">https://tapbez.in/p/{profile.slug}</p>
          <p className="text-sm font-bold text-blue-700 truncate">{profile.name} — {profile.title || "Business Profile"} | Tapbez</p>
          <p className="text-xs text-slate-600 line-clamp-2">{profile.bio || "Connect with modern digital business card, verified contact, social links and portfolio."}</p>
        </div>
      </div>

      {/* Downloads / Resources */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              📁
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Downloads & PDF Documents</h2>
              <p className="text-xs text-slate-500">Allow visitors to download your catalog, menu or corporate profile.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {downloadsList.map((dl, i) => (
            <div key={dl.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{dl.title}</span>
                <span className="text-[10px] text-slate-400">({dl.fileSize})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = downloadsList.filter((_, idx) => idx !== i);
                  updateBlockData("downloads", { items: updated });
                }}
                className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f4f7fc] text-slate-800">
      {/* ============================================================== */}
      {/* 1. TOP HEADER BAR                                              */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Edit Profile</span>
          </h1>
          <p className="text-xs text-slate-500">
            Manage your mobile-first digital business card content and styling.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* View Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("onboarding")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "onboarding" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🎯 Onboarding Flow</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📑 Grid View</span>
            </button>
          </div>

          {/* Public Profile Link Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 max-w-[200px] sm:max-w-[260px]">
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
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Live</span>
          </Link>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {saveMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2 text-xs text-red-800 font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {planLimitError && (
            <Link href="/dashboard/billing" className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold">
              Upgrade Plan
            </Link>
          )}
        </div>
      )}

      {/* MOBILE SWITCHER TAB */}
      <div className="md:hidden flex border-b border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === "editor" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
          }`}
        >
          Section Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === "preview" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
          }`}
        >
          Live Simulator
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE: LEFT EDITOR + RIGHT LIVE SIMULATOR          */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT/CENTER EDITOR */}
        <div
          className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
            mobileTab === "editor" ? "block" : "hidden md:block"
          }`}
        >
          {viewMode === "onboarding" ? (
            /* ============================================================ */
            /* ONBOARDING STEP-BY-STEP DESKTOP EXPERIENCE                   */
            /* ============================================================ */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Stepper Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                      Step {currentStep} of {STEPS.length}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {STEPS[currentStep - 1].label}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {STEPS[currentStep - 1].desc}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 self-start sm:self-auto">
                    {Math.round((currentStep / STEPS.length) * 100)}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                  />
                </div>

                {/* Stepper Nav Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                  {STEPS.map((s) => {
                    const isActive = currentStep === s.id;
                    const isDone = currentStep > s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => goToStep(s.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : isDone
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black bg-black/10">
                          {isDone ? "✓" : s.id}
                        </span>
                        <span>{s.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Content */}
              {currentStep === 1 && renderHeaderSection(true)}
              {currentStep === 2 && renderQuickActionsSection()}
              {currentStep === 3 && renderSocialsSection()}
              {currentStep === 4 && renderAboutAndStatsSection()}
              {currentStep === 5 && renderServicesSection()}
              {currentStep === 6 && renderPortfolioSection()}
              {currentStep === 7 && renderTestimonialsAndMapSection()}
              {currentStep === 8 && renderAppearanceAndSeoSection()}

              {/* Bottom Onboarding Stepper Controls */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => goToStep(Math.max(1, currentStep - 1))}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4 text-slate-600" />
                    <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                  </button>

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      onClick={() => goToStep(Math.min(STEPS.length, currentStep + 1))}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{isPublishing ? "Publishing..." : "Finish & Publish Profile"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* 3-COLUMN GRID OVERVIEW MODE                                  */
            /* ============================================================ */
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 items-start">
              <div className="space-y-6">
                {renderHeaderSection(false)}
                {renderSocialsSection()}
                {renderPortfolioSection()}
              </div>

              <div className="space-y-6">
                {renderQuickActionsSection()}
                {renderAboutAndStatsSection()}
                {renderServicesSection()}
              </div>

              <div className="space-y-6">
                {renderTestimonialsAndMapSection()}
                {renderAppearanceAndSeoSection()}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: REALISTIC LIVE PREVIEW (MOBILE SIMULATOR)       */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-[410px] lg:w-[440px] shrink-0 bg-[#0d121f] border-l border-slate-800 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
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
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
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

              {/* Status Bar */}
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
