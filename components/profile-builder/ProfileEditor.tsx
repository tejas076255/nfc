"use client";

import React, { useState } from "react";
import { FullProfileSnapshot, IndustryType, ProfileBlockItem } from "@/lib/profiles/types";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import { PublicProfileView } from "../public-profile/PublicProfileView";
import { generateVCardString } from "@/lib/profiles/vcard";
import {
  Save,
  Globe,
  Sliders,
  Palette,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Building2,
  MapPin,
  Briefcase,
  Share2,
  User,
  ChevronLeft,
  ArrowRight,
  Star,
  Award,
  Play,
  FileDown,
  HelpCircle,
  Trophy,
  Clock,
  Calendar,
  Users,
  Check,
  Copy,
  Lock,
  Download,
  Layers,
  Sparkles,
  FileText,
} from "lucide-react";
import { compressImageFile } from "@/lib/utils/image";

interface ProfileEditorProps {
  initialProfile: any;
  workspaceId: string;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Identity & Branding",
    shortTitle: "Identity",
    icon: User,
    desc: "Name, designation, organization, tagline, cover photo & circular logo",
  },
  {
    id: 2,
    title: "Quick Contact & vCard",
    shortTitle: "Contact & Maps",
    icon: MapPin,
    desc: "Phone, WhatsApp, email, booking URL, maps location & vCard download test",
  },
  {
    id: 3,
    title: "Highlights, Services & Portfolio",
    shortTitle: "Offerings & Work",
    icon: Briefcase,
    desc: "Professional highlights, services/products & featured portfolio showcase",
  },
  {
    id: 4,
    title: "Socials, Bio, Trust & Resources",
    shortTitle: "Socials & Trust",
    icon: Share2,
    desc: "Connect With Me, Google Review, biography, testimonials, awards, video & FAQs",
  },
  {
    id: 5,
    title: "Sections & Sticky Footer",
    shortTitle: "Section Manager",
    icon: Layers,
    desc: "Enable or disable profile sections and configure sticky mobile footer",
  },
  {
    id: 6,
    title: "Appearance, SEO & Publishing",
    shortTitle: "Theme & Publish",
    icon: Palette,
    desc: "Industry templates, colors, SEO meta tags, draft saving & live publishing",
  },
];

export function ProfileEditor({ initialProfile, workspaceId }: ProfileEditorProps) {
  const [profile, setProfile] = useState<any>(initialProfile);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [planLimitError, setPlanLimitError] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active blocks
  const blocks: ProfileBlockItem[] = profile.blocks || [];

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

  const setBlockData = (blockType: string, fullBlockData: Record<string, any>) => {
    let exists = false;
    const updated = blocks.map((b) => {
      if (b.type === blockType) {
        exists = true;
        return { ...b, isEnabled: true, blockData: fullBlockData };
      }
      return b;
    });
    if (!exists) {
      updated.push({
        id: `b_${blockType}_${Date.now()}`,
        type: blockType as any,
        isEnabled: true,
        sortOrder: updated.length,
        blockData: fullBlockData,
      });
    }
    setProfile({ ...profile, blocks: updated });
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
        isEnabled: true,
        sortOrder: updated.length,
        blockData: {},
      });
    }
    setProfile({ ...profile, blocks: updated });
  };

  const isBlockEnabled = (blockType: string): boolean => {
    const found = blocks.find((b) => b.type === blockType);
    return found ? Boolean(found.isEnabled) : true;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatarUrl" | "coverUrl" | "logoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setErrorMessage(null);
    try {
      const maxWidth = 800;
      const maxHeight = 800;
      const dataUrl = await compressImageFile(file, { maxWidth, maxHeight, quality: 0.85 });
      if (isLegacyCoverLayout) {
        if (field === "avatarUrl") {
          updateBlockData("identity_header", { avatarUrl: dataUrl, logoUrl: headerBlock.avatarUrl, coverUrl: "" });
        } else if (field === "logoUrl") {
          updateBlockData("identity_header", { avatarUrl: headerBlock.coverUrl, logoUrl: dataUrl, coverUrl: "" });
        }
      } else {
        if (field === "avatarUrl") {
          updateBlockData("identity_header", { avatarUrl: dataUrl, coverUrl: "" });
        } else {
          updateBlockData("identity_header", { [field]: dataUrl });
        }
      }
      setSaveMessage(
        `${field === "avatarUrl" ? "Person Photo" : "Company Logo"} uploaded! Save Draft or Publish to apply.`
      );
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process image file.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleTemplateSwitch = (industry: IndustryType) => {
    const template = INDUSTRY_TEMPLATES[industry];
    if (!template) return;

    setProfile({
      ...profile,
      industry,
      templateId: template.id,
      themeConfig: {
        ...profile.themeConfig,
        ...template.defaultTheme,
      },
    });
    setSaveMessage(`Switched to ${template.name} theme. Existing content preserved!`);
    setTimeout(() => setSaveMessage(null), 3500);
  };

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

      setSaveMessage("Draft saved successfully!");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

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

  // Block definitions
  const headerBlock = blocks.find((b) => b.type === "identity_header")?.blockData || {};
  const isLegacyCoverLayout = Boolean(headerBlock.coverUrl && headerBlock.avatarUrl && !headerBlock.logoUrl);
  const effectivePhoto = isLegacyCoverLayout ? headerBlock.coverUrl : (headerBlock.avatarUrl || headerBlock.coverUrl || "");
  const effectiveLogo = isLegacyCoverLayout ? headerBlock.avatarUrl : (headerBlock.logoUrl || "");

  const contactBlock = blocks.find((b) => b.type === "contact_actions")?.blockData || {};
  const highlightsBlock = blocks.find((b) => b.type === "highlights")?.blockData || { stats: [] };
  const aboutBlock = blocks.find((b) => b.type === "about")?.blockData || {};
  const locationBlock = blocks.find((b) => b.type === "location")?.blockData || {};
  const servicesBlock = blocks.find((b) => b.type === "services")?.blockData || { items: [] };
  const portfolioBlock = blocks.find((b) => b.type === "portfolio_gallery")?.blockData || { items: [] };
  const testimonialsBlock = blocks.find((b) => b.type === "testimonials")?.blockData || { items: [] };
  const certificationsBlock = blocks.find((b) => b.type === "certifications")?.blockData || { items: [] };
  const introVideoBlock = blocks.find((b) => b.type === "intro_video")?.blockData || {};
  const downloadsBlock = blocks.find((b) => b.type === "downloads")?.blockData || { items: [] };
  const faqBlock = blocks.find((b) => b.type === "faq")?.blockData || { items: [] };
  const socialsBlock = blocks.find((b) => b.type === "social_links")?.blockData || { links: [] };

  // Highlights handlers
  const handleAddHighlight = () => {
    const current = highlightsBlock.stats || [];
    setBlockData("highlights", {
      stats: [...current, { id: `hl_${Date.now()}`, label: "Clients Served", value: "100+", icon: "users" }],
    });
  };
  const handleUpdateHighlight = (id: string, updates: Record<string, string>) => {
    const current = highlightsBlock.stats || [];
    setBlockData("highlights", {
      stats: current.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };
  const handleDeleteHighlight = (id: string) => {
    const current = highlightsBlock.stats || [];
    setBlockData("highlights", { stats: current.filter((item: any) => item.id !== id) });
  };

  // Services handlers
  const handleAddService = () => {
    const currentItems = servicesBlock.items || [];
    const newItem = {
      id: `svc_${Date.now()}`,
      title: "",
      price: "",
      duration: "",
      category: "",
      description: "",
    };
    setBlockData("services", { items: [...currentItems, newItem] });
  };
  const handleUpdateService = (id: string, updates: Record<string, string>) => {
    const currentItems = servicesBlock.items || [];
    const updated = currentItems.map((item: any) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setBlockData("services", { items: updated });
  };
  const handleDeleteService = (id: string) => {
    const currentItems = servicesBlock.items || [];
    const updated = currentItems.filter((item: any) => item.id !== id);
    setBlockData("services", { items: updated });
  };

  // Portfolio handlers
  const handleAddPortfolioItem = () => {
    const currentItems = portfolioBlock.items || [];
    const newItem = {
      id: `port_${Date.now()}`,
      title: "",
      category: "Design",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      projectUrl: "",
    };
    setBlockData("portfolio_gallery", { items: [...currentItems, newItem] });
  };
  const handleUpdatePortfolioItem = (id: string, updates: Record<string, string>) => {
    const currentItems = portfolioBlock.items || [];
    const updated = currentItems.map((item: any) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setBlockData("portfolio_gallery", { items: updated });
  };
  const handleDeletePortfolioItem = (id: string) => {
    const currentItems = portfolioBlock.items || [];
    const updated = currentItems.filter((item: any) => item.id !== id);
    setBlockData("portfolio_gallery", { items: updated });
  };

  // Testimonials handlers
  const handleAddTestimonial = () => {
    const current = testimonialsBlock.items || [];
    setBlockData("testimonials", {
      items: [
        ...current,
        {
          id: `tm_${Date.now()}`,
          clientName: "",
          clientTitle: "",
          rating: 5,
          content: "",
        },
      ],
    });
  };
  const handleUpdateTestimonial = (id: string, updates: Record<string, any>) => {
    const current = testimonialsBlock.items || [];
    setBlockData("testimonials", {
      items: current.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };
  const handleDeleteTestimonial = (id: string) => {
    const current = testimonialsBlock.items || [];
    setBlockData("testimonials", { items: current.filter((item: any) => item.id !== id) });
  };

  // Certifications handlers
  const handleAddCertification = () => {
    const current = certificationsBlock.items || [];
    setBlockData("certifications", {
      items: [
        ...current,
        { id: `cert_${Date.now()}`, title: "", issuer: "", year: "", credentialUrl: "" },
      ],
    });
  };
  const handleUpdateCertification = (id: string, updates: Record<string, any>) => {
    const current = certificationsBlock.items || [];
    setBlockData("certifications", {
      items: current.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };
  const handleDeleteCertification = (id: string) => {
    const current = certificationsBlock.items || [];
    setBlockData("certifications", { items: current.filter((item: any) => item.id !== id) });
  };

  // Downloads handlers
  const handleAddDownload = () => {
    const current = downloadsBlock.items || [];
    setBlockData("downloads", {
      items: [
        ...current,
        { id: `dl_${Date.now()}`, title: "", fileUrl: "", fileType: "pdf", fileSize: "" },
      ],
    });
  };
  const handleUpdateDownload = (id: string, updates: Record<string, any>) => {
    const current = downloadsBlock.items || [];
    setBlockData("downloads", {
      items: current.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };
  const handleDeleteDownload = (id: string) => {
    const current = downloadsBlock.items || [];
    setBlockData("downloads", { items: current.filter((item: any) => item.id !== id) });
  };

  // FAQs handlers
  const handleAddFaq = () => {
    const current = faqBlock.items || [];
    setBlockData("faq", {
      items: [...current, { id: `faq_${Date.now()}`, question: "", answer: "" }],
    });
  };
  const handleUpdateFaq = (id: string, updates: Record<string, any>) => {
    const current = faqBlock.items || [];
    setBlockData("faq", {
      items: current.map((item: any) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };
  const handleDeleteFaq = (id: string) => {
    const current = faqBlock.items || [];
    setBlockData("faq", { items: current.filter((item: any) => item.id !== id) });
  };

  // Socials handlers
  const handleAddSocial = () => {
    const currentLinks = socialsBlock.links || [];
    const newLink = {
      id: `soc_${Date.now()}`,
      platform: "instagram",
      url: "",
      label: "",
    };
    setBlockData("social_links", { links: [...currentLinks, newLink] });
  };
  const handleUpdateSocial = (id: string, updates: Record<string, string>) => {
    const currentLinks = socialsBlock.links || [];
    const updated = currentLinks.map((link: any) => {
      if (link.id === id) {
        const merged = { ...link, ...updates };
        if (
          !merged.url &&
          merged.label &&
          (merged.label.includes("http") ||
            merged.label.includes(".com") ||
            merged.label.includes(".in") ||
            merged.label.includes("www.") ||
            merged.label.includes("youtu"))
        ) {
          merged.url = merged.label;
          merged.label = "";
        }
        return merged;
      }
      return link;
    });
    setBlockData("social_links", { links: updated });
  };
  const handleDeleteSocial = (id: string) => {
    const currentLinks = socialsBlock.links || [];
    const updated = currentLinks.filter((link: any) => link.id !== id);
    setBlockData("social_links", { links: updated });
  };

  const handleUpdateLocation = (updates: Record<string, string>) => {
    updateBlockData("location", updates);
    if (updates.address !== undefined) {
      updateBlockData("contact_actions", { location: updates.address });
    }
  };

  // Test vCard action
  const handleTestVCard = () => {
    const vCardData = generateVCardString({
      name: headerBlock.name || profile.name || "Cardholder",
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
    link.setAttribute("download", `${(headerBlock.name || profile.name || "contact").replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSaveMessage("Test vCard downloaded to your device!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/p/${profile.slug}` : `/p/${profile.slug}`;

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
      {/* EDITOR ACTION BAR */}
      <div className="h-auto min-h-16 py-2 px-3 sm:px-6 border-b border-white/10 glass-panel flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
              profile.status === "published"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {profile.status}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-none flex items-center gap-1">
            <span>Slug:</span>
            <code className="text-teal-400 font-mono">/p/{profile.slug}</code>
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Public URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={`/p/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
            title="View Live Profile"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              mobileTab === "editor" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              mobileTab === "preview" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish Profile"}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {saveMessage && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 text-xs text-red-400 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {planLimitError && (
            <a
              href="/dashboard/billing"
              className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      )}

      {/* MAIN LAYOUT SPLIT */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: GUIDED STEP BUILDER */}
        <div
          className={`md:col-span-7 lg:col-span-6 border-r border-white/10 flex flex-col bg-[#07090e] ${
            mobileTab === "editor" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* STEPPER PROGRESS NAVIGATION */}
          <div className="p-3 sm:p-5 border-b border-white/10 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white">
                Step {currentStep} of {ONBOARDING_STEPS.length}: {ONBOARDING_STEPS[currentStep - 1].title}
              </span>
              <span className="text-[11px] text-teal-400 font-mono">
                {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% Complete
              </span>
            </div>

            {/* Stepper progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>

            {/* 6 Step Navigation Tabs */}
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
              {ONBOARDING_STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`py-1.5 px-0.5 sm:py-2 sm:px-1 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all border cursor-pointer ${
                      isActive
                        ? "bg-teal-600/20 border-teal-500 text-white shadow-md shadow-teal-500/10 font-bold"
                        : isPast
                        ? "bg-slate-950/60 border-emerald-500/30 text-emerald-300 hover:bg-slate-800"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                      )}
                    </div>
                    <span className="text-[10px] leading-tight truncate w-full hidden sm:block">
                      {step.shortTitle}
                    </span>
                    <span className="text-[9px] font-mono sm:hidden">{step.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SCROLLABLE STEP CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* STEP 1: IDENTITY & BRANDING */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-400" />
                    <span>Core Identity & Branding</span>
                  </h3>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={headerBlock.name || profile.name}
                          onChange={(e) => {
                            setProfile({ ...profile, name: e.target.value });
                            updateBlockData("identity_header", { name: e.target.value });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Professional Designation / Title *
                        </label>
                        <input
                          type="text"
                          value={headerBlock.title || profile.title || ""}
                          onChange={(e) => {
                            setProfile({ ...profile, title: e.target.value });
                            updateBlockData("identity_header", { title: e.target.value });
                          }}
                          placeholder="e.g. Founder, Legal Counsel, Trainer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={headerBlock.company || ""}
                          onChange={(e) => updateBlockData("identity_header", { company: e.target.value })}
                          placeholder="e.g. Vertex Advisory"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Public URL Slug (Mutable)
                        </label>
                        <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 overflow-hidden px-3">
                          <span className="text-xs text-slate-500 font-mono">/p/</span>
                          <input
                            type="text"
                            value={profile.slug}
                            onChange={(e) => setProfile({ ...profile, slug: e.target.value })}
                            className="w-full py-2.5 bg-transparent text-white text-xs font-mono focus:outline-none pl-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Business Category</label>
                        <input
                          type="text"
                          value={headerBlock.category || ""}
                          onChange={(e) => updateBlockData("identity_header", { category: e.target.value })}
                          placeholder="e.g. Legal, Tech, Beauty"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Tagline / Value Proposition</label>
                        <input
                          type="text"
                          value={headerBlock.tagline || ""}
                          onChange={(e) => updateBlockData("identity_header", { tagline: e.target.value })}
                          placeholder="e.g. Strategic counsel for growth"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Verified Badge Title</label>
                        <input
                          type="text"
                          value={headerBlock.badge || ""}
                          onChange={(e) => updateBlockData("identity_header", { badge: e.target.value })}
                          placeholder="e.g. Verified Profile"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* IMAGERY ASSETS: COVER PHOTO & CIRCULAR LOGO */}
                    <div className="pt-3 space-y-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Profile Imagery & Branding
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Cover image is displayed as the header banner. Circular logo overlaps the banner cleanly.
                          </p>
                        </div>
                        {(effectivePhoto || effectiveLogo) && (
                          <button
                            type="button"
                            onClick={() => {
                              updateBlockData("identity_header", {
                                avatarUrl: effectiveLogo,
                                logoUrl: effectivePhoto,
                                coverUrl: "",
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            ⇄ Swap Photo & Logo
                          </button>
                        )}
                      </div>

                      {/* 1. Cover Photo Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/20 shrink-0 flex items-center justify-center">
                          {effectivePhoto ? (
                            <img src={effectivePhoto} alt="Cover Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-500">No Photo</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Cover / Header Photo</span>
                            {effectivePhoto && (
                              <button
                                type="button"
                                onClick={() => updateBlockData("identity_header", { avatarUrl: "", coverUrl: "" })}
                                className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === "avatarUrl" ? "Processing..." : "Upload Photo"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingField === "avatarUrl"}
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "avatarUrl")}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or enter image URL"
                              value={effectivePhoto?.startsWith("data:") ? "(Uploaded local image)" : effectivePhoto}
                              onChange={(e) => updateBlockData("identity_header", { avatarUrl: e.target.value, coverUrl: "" })}
                              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Circular Company Logo */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-slate-800 shrink-0 flex items-center justify-center p-2 shadow-sm">
                          {effectiveLogo ? (
                            <img src={effectiveLogo} alt="Logo Preview" className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Circular Brand / Company Logo</span>
                            {effectiveLogo && (
                              <button
                                type="button"
                                onClick={() => updateBlockData("identity_header", { logoUrl: "" })}
                                className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === "logoUrl" ? "Processing..." : "Upload Logo"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingField === "logoUrl"}
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "logoUrl")}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or enter logo URL"
                              value={effectiveLogo?.startsWith("data:") ? "(Uploaded local logo)" : effectiveLogo}
                              onChange={(e) => updateBlockData("identity_header", { logoUrl: e.target.value })}
                              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: QUICK CONTACT & VCARD */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span>Contact Actions & vCard Settings</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleTestVCard}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Test download vCard (.vcf) file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Test vCard</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Call)</label>
                      <input
                        type="text"
                        value={contactBlock.phone || ""}
                        onChange={(e) => updateBlockData("contact_actions", { phone: e.target.value })}
                        placeholder="+91 98200 12345"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={contactBlock.whatsapp || ""}
                        onChange={(e) => updateBlockData("contact_actions", { whatsapp: e.target.value })}
                        placeholder="+919820012345"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={contactBlock.email || ""}
                        onChange={(e) => updateBlockData("contact_actions", { email: e.target.value })}
                        placeholder="contact@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
                      <input
                        type="url"
                        value={contactBlock.websiteUrl || ""}
                        onChange={(e) => updateBlockData("contact_actions", { websiteUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Book Appointment URL (Calendly, Cal.com, etc.)
                      </label>
                      <input
                        type="url"
                        value={contactBlock.bookingUrl || ""}
                        onChange={(e) => updateBlockData("contact_actions", { bookingUrl: e.target.value })}
                        placeholder="https://calendly.com/... or booking page"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Directions */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Physical Office / Storefront Location</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Business Address</label>
                    <input
                      type="text"
                      value={locationBlock.address || contactBlock.location || ""}
                      onChange={(e) => handleUpdateLocation({ address: e.target.value })}
                      placeholder="e.g. 402, High Street Mall, Marine Drive, Mumbai"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Google Maps Direct Link</label>
                    <input
                      type="url"
                      value={locationBlock.mapUrl || ""}
                      onChange={(e) => handleUpdateLocation({ mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: HIGHLIGHTS, SERVICES & PORTFOLIO */}
            {currentStep === 3 && (
              <div className="space-y-5">
                {/* 1. Highlights Manager */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>Professional Highlights & Statistics</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Highlight years of experience, clients served, founding year, or ratings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {highlightsBlock.stats?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-3 bg-slate-900/50 rounded-xl border border-white/5">
                        No custom highlights added. Default industry highlights will be displayed automatically.
                      </p>
                    ) : (
                      highlightsBlock.stats?.map((h: any) => (
                        <div
                          key={h.id}
                          className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex items-center gap-2.5"
                        >
                          <select
                            value={h.icon || "clock"}
                            onChange={(e) => handleUpdateHighlight(h.id, { icon: e.target.value })}
                            className="px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                          >
                            <option value="clock">Clock (Years)</option>
                            <option value="users">Users (Clients)</option>
                            <option value="trophy">Trophy (Success)</option>
                            <option value="star">Star (Rating)</option>
                            <option value="calendar">Calendar (Founded)</option>
                            <option value="award">Award</option>
                            <option value="briefcase">Briefcase</option>
                          </select>
                          <input
                            type="text"
                            value={h.value || ""}
                            onChange={(e) => handleUpdateHighlight(h.id, { value: e.target.value })}
                            placeholder="Value (e.g. 10+)"
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={h.label || ""}
                            onChange={(e) => handleUpdateHighlight(h.id, { label: e.target.value })}
                            placeholder="Label (e.g. Years Exp)"
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteHighlight(h.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Services Manager */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span>Services & Products Offerings</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add services with prices, descriptions, and booking actions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {servicesBlock.items?.map((svc: any) => (
                      <div key={svc.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={svc.title || ""}
                            onChange={(e) => handleUpdateService(svc.id, { title: e.target.value })}
                            placeholder="Service Title (e.g. Contract Review)"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={svc.price || ""}
                            onChange={(e) => handleUpdateService(svc.id, { price: e.target.value })}
                            placeholder="Price (e.g. ₹25,000)"
                            className="w-28 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-teal-400 text-xs font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteService(svc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={svc.description || ""}
                          onChange={(e) => handleUpdateService(svc.id, { description: e.target.value })}
                          placeholder="Short description of benefits, deliverables or specs..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Portfolio Manager */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Featured Portfolio & Projects</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Showcase completed projects with thumbnails and live links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPortfolioItem}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {portfolioBlock.items?.map((item: any) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => handleUpdatePortfolioItem(item.id, { title: e.target.value })}
                            placeholder="Project Title"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={item.category || ""}
                            onChange={(e) => handleUpdatePortfolioItem(item.id, { category: e.target.value })}
                            placeholder="Category (e.g. Web, Events)"
                            className="w-32 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeletePortfolioItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.imageUrl || ""}
                          onChange={(e) => handleUpdatePortfolioItem(item.id, { imageUrl: e.target.value })}
                          placeholder="Image URL (https://...)"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                        />
                        <input
                          type="url"
                          value={item.projectUrl || ""}
                          onChange={(e) => handleUpdatePortfolioItem(item.id, { projectUrl: e.target.value })}
                          placeholder="Project destination URL (https://...)"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SOCIALS, BIO, TRUST & RESOURCES */}
            {currentStep === 4 && (
              <div className="space-y-5">
                {/* 1. Connect With Me (Socials) */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-teal-400" />
                        <span>Connect With Me (Social Links)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add links to your social channels and websites.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {socialsBlock.links?.map((soc: any) => (
                      <div key={soc.id} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={soc.platform || "instagram"}
                            onChange={(e) => handleUpdateSocial(soc.id, { platform: e.target.value })}
                            className="w-36 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs capitalize shrink-0"
                          >
                            <option value="google_review">⭐ Google Review</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="youtube">YouTube</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="telegram">Telegram</option>
                            <option value="website">Custom Website</option>
                          </select>
                          <input
                            type="text"
                            value={soc.url || ""}
                            onChange={(e) => handleUpdateSocial(soc.id, { url: e.target.value })}
                            placeholder="Paste URL (https://... or @username)"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteSocial(soc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={soc.label || ""}
                          onChange={(e) => handleUpdateSocial(soc.id, { label: e.target.value })}
                          placeholder="Button title / label (optional)"
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-950/70 border border-white/5 text-slate-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. About Me Biography */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>About Me / About Business</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Headline</label>
                    <input
                      type="text"
                      value={aboutBlock.headline || ""}
                      onChange={(e) => updateBlockData("about", { headline: e.target.value })}
                      placeholder="e.g. Specializing in Cross-Border M&A and Strategic Compliance"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Biography</label>
                    <textarea
                      rows={4}
                      value={aboutBlock.bio || profile.bio || ""}
                      onChange={(e) => {
                        setProfile({ ...profile, bio: e.target.value });
                        updateBlockData("about", { bio: e.target.value });
                      }}
                      placeholder="Explain your professional journey, expertise, client results, and value offered..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-500 resize-none"
                    />
                  </div>
                </div>

                {/* 3. Client Testimonials */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Client Testimonials Manager</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Build trust with authentic customer reviews and ratings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Review</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {testimonialsBlock.items?.map((t: any) => (
                      <div key={t.id} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={t.clientName || ""}
                            onChange={(e) => handleUpdateTestimonial(t.id, { clientName: e.target.value })}
                            placeholder="Client Name"
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={t.clientTitle || ""}
                            onChange={(e) => handleUpdateTestimonial(t.id, { clientTitle: e.target.value })}
                            placeholder="Designation / Company"
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={t.content || ""}
                          onChange={(e) => handleUpdateTestimonial(t.id, { content: e.target.value })}
                          placeholder="Client review text..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Certifications & Video & FAQs */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-rose-400" />
                    <span>Introduction Video</span>
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      YouTube / Vimeo / Video URL
                    </label>
                    <input
                      type="url"
                      value={introVideoBlock.videoUrl || ""}
                      onChange={(e) => updateBlockData("intro_video", { videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SECTIONS & STICKY FOOTER */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>Centralized Section Visibility Manager</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enable or disable specific sections on your public card.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {[
                      { key: "contact_actions", label: "Quick Contact Buttons" },
                      { key: "highlights", label: "Professional Highlights" },
                      { key: "social_links", label: "Connect With Me Socials" },
                      { key: "about", label: "About Me / Biography" },
                      { key: "services", label: "Services & Products" },
                      { key: "portfolio_gallery", label: "Featured Portfolio" },
                      { key: "intro_video", label: "Introduction Video" },
                      { key: "testimonials", label: "Client Testimonials" },
                      { key: "certifications", label: "Certifications & Awards" },
                      { key: "downloads", label: "Downloads & Resources" },
                      { key: "location", label: "Business Location & Hours" },
                      { key: "faq", label: "Frequently Asked Questions" },
                      { key: "lead_form", label: "Lead Inquiry Form" },
                    ].map((sec) => {
                      const enabled = isBlockEnabled(sec.key);
                      return (
                        <div
                          key={sec.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/10"
                        >
                          <span className="text-xs font-semibold text-slate-200">{sec.label}</span>
                          <button
                            type="button"
                            onClick={() => toggleBlockEnabled(sec.key)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                              enabled
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                                : "bg-slate-800 text-slate-500 border border-white/5"
                            }`}
                          >
                            {enabled ? "Visible" : "Hidden"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Sticky Mobile Footer Bar</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    The sticky footer provides 3 essential one-tap conversions on mobile screens:
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-teal-300 font-bold">
                      1. Save Contact
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-blue-300 font-bold">
                      2. Inquiry Form
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-300 font-bold">
                      3. Install App
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: APPEARANCE, SEO & PUBLISHING */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-teal-400" />
                      <span>Choose Industry Template Family</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Switching template updates visual styling and accents while preserving all your entered content.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleTemplateSwitch(tmpl.industry)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          profile.industry === tmpl.industry
                            ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                            : "border-white/10 bg-slate-900/60 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{tmpl.name}</span>
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">{tmpl.tagline}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white">Visual Customization</h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Accent Color Hex</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl border border-white/20 shrink-0 shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: profile.themeConfig?.accentColor || "#a855f7" }}
                      >
                        <input
                          type="color"
                          value={profile.themeConfig?.accentColor || "#a855f7"}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              themeConfig: { ...profile.themeConfig, accentColor: e.target.value },
                            })
                          }
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={profile.themeConfig?.accentColor || "#a855f7"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            themeConfig: { ...profile.themeConfig, accentColor: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                        placeholder="#a855f7"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Avatar Shape</label>
                    <select
                      value={profile.themeConfig?.avatarShape || "circle"}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          themeConfig: { ...profile.themeConfig, avatarShape: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs cursor-pointer focus:outline-none focus:border-teal-500"
                    >
                      <option value="circle">Circle</option>
                      <option value="rounded">Rounded Square</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white">SEO & Search Indexing</h3>
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(profile.searchIndexed)}
                      onChange={(e) => setProfile({ ...profile, searchIndexed: e.target.checked ? 1 : 0 })}
                      className="rounded text-teal-500 focus:ring-0"
                    />
                    <span>Allow search engines (Google, Bing) to index this digital profile</span>
                  </label>
                </div>

                {profile.status === "published" && (
                  <div className="glass-card p-5 rounded-2xl border border-red-500/20 bg-red-950/20 space-y-2">
                    <h4 className="text-xs font-bold text-red-400">Danger Zone</h4>
                    <p className="text-[11px] text-slate-400">
                      Unpublishing will make this profile inaccessible to public visitors and cards.
                    </p>
                    <button
                      type="button"
                      onClick={handleUnpublish}
                      className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Unpublish Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PREVIOUS / NEXT STEP FOOTER */}
          <div className="p-3 sm:p-5 border-t border-white/10 bg-slate-950/60 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {currentStep < ONBOARDING_STEPS.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(ONBOARDING_STEPS.length, prev + 1))}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
              >
                <span>Next: {ONBOARDING_STEPS[currentStep].shortTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ml-auto"
              >
                <Globe className="w-4 h-4" />
                <span>{isPublishing ? "Publishing..." : "Finish & Publish Profile"}</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE SIMULATOR PREVIEW */}
        <div
          className={`md:col-span-5 lg:col-span-6 bg-[#04060a] p-3 sm:p-6 flex flex-col items-center justify-start overflow-y-auto ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="w-full max-w-sm sticky top-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span>Live Public Preview</span>
              </span>
              <span className="text-[10px] bg-slate-900 px-2.5 py-0.5 rounded-full border border-white/10 uppercase font-mono">
                {profile.industry.replace("_", " ")}
              </span>
            </div>

            {/* Mobile Viewport Simulation Frame */}
            <div className="rounded-2xl sm:rounded-[36px] sm:p-2.5 sm:bg-slate-900 sm:border-4 sm:border-slate-800 shadow-2xl relative overflow-hidden w-full">
              <div className="w-full rounded-2xl sm:rounded-[28px] overflow-hidden max-h-[82vh] sm:max-h-[720px] overflow-y-auto">
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
