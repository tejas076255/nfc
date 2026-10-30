"use client";

import React, { useState } from "react";
import { FullProfileSnapshot, IndustryType, ProfileBlockItem } from "@/lib/profiles/types";
import { INDUSTRY_TEMPLATES } from "@/lib/profiles/templates";
import { PublicProfileView } from "../public-profile/PublicProfileView";
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
} from "lucide-react";
import { compressImageFile } from "@/lib/utils/image";

interface ProfileEditorProps {
  initialProfile: any;
  workspaceId: string;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Identity & Visual Assets",
    shortTitle: "Identity",
    icon: User,
    desc: "Your name, title, organization, profile photo & business logo",
  },
  {
    id: 2,
    title: "Contact & Physical Location",
    shortTitle: "Contact & Maps",
    icon: MapPin,
    desc: "Phone, WhatsApp, email, office address & Google Maps",
  },
  {
    id: 3,
    title: "Services, Products & Portfolio",
    shortTitle: "Services & Portfolio",
    icon: Briefcase,
    desc: "Offerings, pricing badges & featured portfolio showcase",
  },
  {
    id: 4,
    title: "Socials & Biography",
    shortTitle: "Socials & Bio",
    icon: Share2,
    desc: "Personal story, credentials & social profiles",
  },
  {
    id: 5,
    title: "Theme & Design Styling",
    shortTitle: "Theme",
    icon: Palette,
    desc: "Select visual template, accent color & avatar shape",
  },
];

export function ProfileEditor({ initialProfile, workspaceId }: ProfileEditorProps) {
  const [profile, setProfile] = useState<any>(initialProfile);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [planLimitError, setPlanLimitError] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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

  const toggleBlockEnabled = (blockType: string) => {
    const updated = blocks.map((b) => {
      if (b.type === blockType) {
        return { ...b, isEnabled: !b.isEnabled };
      }
      return b;
    });
    setProfile({ ...profile, blocks: updated });
  };

  const handleTemplateSwitch = (industry: IndustryType) => {
    const template = INDUSTRY_TEMPLATES[industry];
    if (!template) return;

    // Preserve existing content, adopt new theme and new default industry
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
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
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
      if (!res.ok) throw new Error(data.error || "Failed to save draft");

      setSaveMessage("Draft saved successfully to Cloudflare D1.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (options?: { unpublishOthers?: boolean }) => {
    setIsPublishing(true);
    setErrorMessage(null);
    setSaveMessage(null);
    setPlanLimitError(false);

    try {
      // First save current draft
      const draftRes = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
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

      if (!draftRes.ok) {
        const draftData = (await draftRes.json().catch(() => ({}))) as any;
        throw new Error(draftData.error || "Failed to save draft before publishing");
      }

      // Explicit publish trigger
      const res = await fetch(`/api/profiles/${profile.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unpublishOthers: Boolean(options?.unpublishOthers) }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        if (data.error && data.error.includes("PLAN_LIMIT_REACHED")) {
          setPlanLimitError(true);
        }
        throw new Error(data.error || "Failed to publish profile");
      }

      setProfile({ ...profile, status: "published" });
      setPlanLimitError(false);
      setSaveMessage(`Published successfully! Snapshot v${data.versionNumber} is live.`);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("Are you sure you want to unpublish this profile? Visitors will see an unavailable state.")) return;
    try {
      const res = await fetch(`/api/profiles/${profile.id}/unpublish`, { method: "POST" });
      if (res.ok) {
        setProfile({ ...profile, status: "unpublished" });
        setSaveMessage("Profile has been unpublished.");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const headerBlock = blocks.find((b) => b.type === "identity_header")?.blockData || {};
  const isLegacyCoverLayout = Boolean(headerBlock.coverUrl && headerBlock.avatarUrl && !headerBlock.logoUrl);
  const effectivePhoto = isLegacyCoverLayout ? headerBlock.coverUrl : (headerBlock.avatarUrl || headerBlock.coverUrl || "");
  const effectiveLogo = isLegacyCoverLayout ? headerBlock.avatarUrl : (headerBlock.logoUrl || "");
  const contactBlock = blocks.find((b) => b.type === "contact_actions")?.blockData || {};
  const aboutBlock = blocks.find((b) => b.type === "about")?.blockData || {};
  const locationBlock = blocks.find((b) => b.type === "location")?.blockData || {};
  const servicesBlock = blocks.find((b) => b.type === "services")?.blockData || { items: [] };
  const portfolioBlock = blocks.find((b) => b.type === "portfolio_gallery")?.blockData || { items: [] };
  const socialsBlock = blocks.find((b) => b.type === "social_links")?.blockData || { links: [] };

  const handleAddService = () => {
    const currentItems = servicesBlock.items || [];
    const newItem = {
      id: `svc_${Date.now()}`,
      title: "",
      price: "",
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

  const handleAddPortfolioItem = () => {
    const currentItems = portfolioBlock.items || [];
    const newItem = {
      id: `port_${Date.now()}`,
      title: "",
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

  const handlePortfolioImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`port_${itemId}`);
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.82 });
      handleUpdatePortfolioItem(itemId, { imageUrl: dataUrl });
      setSaveMessage("Portfolio image uploaded! Save Draft or Publish to apply.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process portfolio image.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAddSocial = () => {
    const currentLinks = socialsBlock.links || [];
    const newLink = {
      id: `soc_${Date.now()}`,
      platform: "instagram",
      url: "",
    };
    setBlockData("social_links", { links: [...currentLinks, newLink] });
  };

  const handleUpdateSocial = (id: string, updates: Record<string, string>) => {
    const currentLinks = socialsBlock.links || [];
    const updated = currentLinks.map((link: any) =>
      link.id === id ? { ...link, ...updates } : link
    );
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
          <span className="text-xs text-slate-400 truncate max-w-[130px] sm:max-w-none">
            Slug: <code className="text-blue-400 font-mono">/p/{profile.slug}</code>
          </span>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center bg-slate-900 rounded-xl p-0.5 border border-white/10 order-last sm:order-none w-full sm:w-auto justify-center mt-1 sm:mt-0">
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === "editor" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === "preview" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {profile.status === "published" && (
            <a
              href={`/p/${profile.slug}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Open Live Public Profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live</span>
            </a>
          )}

          {profile.status === "published" && (
            <button
              onClick={handleUnpublish}
              className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              Unpublish
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Draft"}</span>
            <span className="sm:hidden">{isSaving ? "..." : "Save"}</span>
          </button>

          <button
            onClick={() => handlePublish()}
            disabled={isPublishing}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPublishing ? "Publishing..." : "Publish"}</span>
            <span className="sm:hidden">{isPublishing ? "..." : "Publish"}</span>
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
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* DESKTOP SPLIT VIEW OR MOBILE TABBED VIEW */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 md:h-[calc(100vh-64px)]">
        {/* LEFT COLUMN: ONBOARDING WIZARD CONTROLS */}
        <div
          className={`md:col-span-7 lg:col-span-6 flex flex-col h-full border-r border-white/10 ${
            mobileTab === "preview" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* STICKY TOP STEPPER PROGRESS & CLICKABLE TABS */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl z-10 space-y-3">
            {/* Step Meta & Percentage */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {currentStep}
                </span>
                <span className="font-bold text-white">
                  Step {currentStep} of {ONBOARDING_STEPS.length}: {ONBOARDING_STEPS[currentStep - 1].title}
                </span>
              </div>
              <span className="text-[11px] text-blue-400 font-semibold">
                {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}% Complete
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Clickable Step Navigation Pills */}
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5 pt-1">
              {ONBOARDING_STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`py-1.5 px-0.5 sm:py-2 sm:px-1 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all border ${
                      isActive
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 font-bold"
                        : isPast
                        ? "bg-slate-950/60 border-emerald-500/30 text-emerald-300 hover:bg-slate-800"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                      ) : (
                        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                      )}
                    </div>
                    <span className="text-[10px] leading-tight truncate w-full hidden sm:block">
                      {step.shortTitle}
                    </span>
                    <span className="text-[9px] font-mono sm:hidden">
                      {step.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SCROLLABLE STEP CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
            {/* STEP 1: IDENTITY & IMAGERY */}
            {currentStep === 1 && (
            <div className="space-y-6">
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>Core Identity</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={headerBlock.name || profile.name}
                        onChange={(e) => {
                          setProfile({ ...profile, name: e.target.value });
                          updateBlockData("identity_header", { name: e.target.value });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={headerBlock.title || profile.title || ""}
                        onChange={(e) => {
                          setProfile({ ...profile, title: e.target.value });
                          updateBlockData("identity_header", { title: e.target.value });
                        }}
                        placeholder="e.g. Senior Partner / Founder"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={headerBlock.company || ""}
                        onChange={(e) => updateBlockData("identity_header", { company: e.target.value })}
                        placeholder="e.g. Vertex Legal Advisory"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
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

                  {/* VISUAL ASSETS: PERSON PHOTO & COMPANY LOGO */}
                  <div className="pt-2 space-y-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Profile Imagery & Branding
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Person photo appears as the top header of your card. Company logo is displayed as a clean brand badge.
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

                    {isLegacyCoverLayout && (
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-blue-200">
                          <span className="font-semibold text-white">✨ Layout Updated:</span> Person photo is now card header and logo is brand badge. Click save to store these slots.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateBlockData("identity_header", {
                              avatarUrl: headerBlock.coverUrl,
                              logoUrl: headerBlock.avatarUrl,
                              coverUrl: "",
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm cursor-pointer"
                        >
                          Save New Slots
                        </button>
                      </div>
                    )}

                    {/* 1. Person / Profile Photo (Top Header) */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shrink-0 flex items-center justify-center self-center sm:self-auto">
                        {effectivePhoto ? (
                          <img
                            src={effectivePhoto}
                            alt="Person Photo Preview"
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="text-[10px] text-slate-500 font-medium text-center">No Photo</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Person Photo (Card Top Header)</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">Main</span>
                          </div>
                          {effectivePhoto && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isLegacyCoverLayout) {
                                  updateBlockData("identity_header", { avatarUrl: "", logoUrl: headerBlock.avatarUrl, coverUrl: "" });
                                } else {
                                  updateBlockData("identity_header", { avatarUrl: "", coverUrl: "" });
                                }
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <label className="cursor-pointer px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingField === "avatarUrl" ? "Processing..." : "Upload Person Photo"}</span>
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
                            onChange={(e) => {
                              if (isLegacyCoverLayout) {
                                updateBlockData("identity_header", { avatarUrl: e.target.value, logoUrl: headerBlock.avatarUrl, coverUrl: "" });
                              } else {
                                updateBlockData("identity_header", { avatarUrl: e.target.value, coverUrl: "" });
                              }
                            }}
                            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Company / Brand Logo */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/20 shrink-0 flex items-center justify-center p-1.5 self-center sm:self-auto bg-white/5">
                        {effectiveLogo ? (
                          <img
                            src={effectiveLogo}
                            alt="Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-7 h-7 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Company / Business Logo</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Brand Badge</span>
                          </div>
                          {effectiveLogo && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isLegacyCoverLayout) {
                                  updateBlockData("identity_header", { avatarUrl: headerBlock.coverUrl, logoUrl: "", coverUrl: "" });
                                } else {
                                  updateBlockData("identity_header", { logoUrl: "" });
                                }
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <label className="cursor-pointer px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0">
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
                            onChange={(e) => {
                              if (isLegacyCoverLayout) {
                                updateBlockData("identity_header", { avatarUrl: headerBlock.coverUrl, logoUrl: e.target.value, coverUrl: "" });
                              } else {
                                updateBlockData("identity_header", { logoUrl: e.target.value });
                              }
                            }}
                            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT & LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Contact Actions Block */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Contact & Communication</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number (vCard)
                    </label>
                    <input
                      type="text"
                      value={contactBlock.phone || ""}
                      onChange={(e) => updateBlockData("contact_actions", { phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      WhatsApp Chat Number
                    </label>
                    <input
                      type="text"
                      value={contactBlock.whatsapp || ""}
                      onChange={(e) => updateBlockData("contact_actions", { whatsapp: e.target.value })}
                      placeholder="+919820012345"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactBlock.email || ""}
                      onChange={(e) => updateBlockData("contact_actions", { email: e.target.value })}
                      placeholder="siddharth@vertex.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={contactBlock.websiteUrl || ""}
                      onChange={(e) => updateBlockData("contact_actions", { websiteUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Address & Google Maps Block */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Physical Address & Google Maps</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Enter your office, shop, or clinic location so visitors can click the &quot;Map&quot; button on your card and get instant directions.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Business / Office Address
                    </label>
                    <input
                      type="text"
                      value={locationBlock.address || contactBlock.location || ""}
                      onChange={(e) => handleUpdateLocation({ address: e.target.value })}
                      placeholder="e.g. Shop 12, Titanium City Center, Satellite, Ahmedabad, Gujarat 380015"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        City / Region
                      </label>
                      <input
                        type="text"
                        value={locationBlock.city || ""}
                        onChange={(e) => handleUpdateLocation({ city: e.target.value })}
                        placeholder="e.g. Ahmedabad, Gujarat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Google Maps Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={locationBlock.mapUrl || ""}
                        onChange={(e) => handleUpdateLocation({ mapUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SERVICES & PRODUCTS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Services & Products</h3>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                      {(servicesBlock.items || []).length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service / Product</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Showcase your key offerings, pricing badges, and service descriptions directly on your NFC profile.
                </p>

                <div className="space-y-3">
                  {(servicesBlock.items || []).length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-400 space-y-2">
                      <p>No services or products added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        + Add Your First Service
                      </button>
                    </div>
                  ) : (
                    servicesBlock.items.map((svc: any, index: number) => (
                      <div key={svc.id || index} className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-2.5 sm:gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                              Service / Product Title
                            </label>
                            <input
                              type="text"
                              value={svc.title || ""}
                              onChange={(e) => handleUpdateService(svc.id, { title: e.target.value })}
                              placeholder="e.g. Commercial Contract Review, Hair Spa"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1 sm:w-28 sm:flex-none">
                              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                                Price Badge
                              </label>
                              <input
                                type="text"
                                value={svc.price || ""}
                                onChange={(e) => handleUpdateService(svc.id, { price: e.target.value })}
                                placeholder="e.g. ₹25,000"
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-blue-400 font-semibold text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteService(svc.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                            Description / Summary
                          </label>
                          <input
                            type="text"
                            value={svc.description || ""}
                            onChange={(e) => handleUpdateService(svc.id, { description: e.target.value })}
                            placeholder="Brief description of what's delivered..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* FEATURED PORTFOLIO & PROJECTS BLOCK */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Featured Portfolio & Projects</h3>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
                      {(portfolioBlock.items || []).length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPortfolioItem}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Portfolio Item</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Showcase your creative projects, properties, client work, or product photos directly on your profile card.
                </p>

                <div className="space-y-4">
                  {(portfolioBlock.items || []).length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-400 space-y-2">
                      <p>No portfolio projects or gallery photos added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddPortfolioItem}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        + Add Your First Project / Photo
                      </button>
                    </div>
                  ) : (
                    portfolioBlock.items.map((item: any, index: number) => (
                      <div
                        key={item.id || index}
                        className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3.5"
                      >
                        <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                          {/* Image Preview & Upload Controls */}
                          <div className="flex sm:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 relative group">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title || "Portfolio preview"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-2 text-center text-[10px]">
                                  <ImageIcon className="w-5 h-5 mb-1" />
                                  <span>No Image</span>
                                </div>
                              )}
                            </div>

                            <label className="flex-1 sm:flex-none cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-center">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === `port_${item.id}` ? "Uploading..." : "Upload"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePortfolioImageUpload(e, item.id)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Fields: Title, Description, Image URL, Project URL */}
                          <div className="flex-1 w-full space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1">
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                                  Project / Item Title
                                </label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) =>
                                    handleUpdatePortfolioItem(item.id, { title: e.target.value })
                                  }
                                  placeholder="e.g. The Sky Villa, Fintech Rebrand 2026"
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeletePortfolioItem(item.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end mb-0.5"
                                title="Delete portfolio item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                                Subtitle / Description
                              </label>
                              <input
                                type="text"
                                value={item.description || ""}
                                onChange={(e) =>
                                  handleUpdatePortfolioItem(item.id, { description: e.target.value })
                                }
                                placeholder="e.g. 5BHK Penthouse with private pool. ₹14.5 Cr"
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-300 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                                  Image URL (or use Upload button)
                                </label>
                                <input
                                  type="url"
                                  value={item.imageUrl || ""}
                                  onChange={(e) =>
                                    handleUpdatePortfolioItem(item.id, { imageUrl: e.target.value })
                                  }
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 text-xs font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                                  Project / Case Study Link (Optional)
                                </label>
                                <input
                                  type="url"
                                  value={item.projectUrl || ""}
                                  onChange={(e) =>
                                    handleUpdatePortfolioItem(item.id, { projectUrl: e.target.value })
                                  }
                                  placeholder="https://behance.net/..."
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SOCIALS & ABOUT BIO */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* About & Bio Block */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white">About & Bio Narrative</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={aboutBlock.headline || ""}
                    onChange={(e) => updateBlockData("about", { headline: e.target.value })}
                    placeholder="Short punchy elevator statement"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bio Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={aboutBlock.bio || profile.bio || ""}
                    onChange={(e) => {
                      setProfile({ ...profile, bio: e.target.value });
                      updateBlockData("about", { bio: e.target.value });
                    }}
                    placeholder="Tell visitors about your background, credentials, and achievements."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Social Accounts & Online Presence */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Social Accounts & Links</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      {(socialsBlock.links || []).length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Social Account</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Connect your LinkedIn, Instagram, X/Twitter, WhatsApp, Facebook, or YouTube profiles.
                </p>

                <div className="space-y-2.5">
                  {(socialsBlock.links || []).length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-400 space-y-2">
                      <p>No social accounts added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddSocial}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        + Add Your First Social Link
                      </button>
                    </div>
                  ) : (
                    socialsBlock.links.map((soc: any, index: number) => (
                      <div key={soc.id || index} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={soc.platform || "instagram"}
                            onChange={(e) => handleUpdateSocial(soc.id, { platform: e.target.value })}
                            className="w-36 sm:w-44 px-2.5 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs capitalize focus:outline-none"
                          >
                            <option value="google_review">⭐ Google Review</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="youtube">YouTube</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="telegram">Telegram</option>
                            <option value="github">GitHub</option>
                            <option value="tiktok">TikTok</option>
                            <option value="website">Custom Website</option>
                          </select>

                          <input
                            type="text"
                            value={soc.label || ""}
                            onChange={(e) => handleUpdateSocial(soc.id, { label: e.target.value })}
                            placeholder={soc.platform === "google_review" ? "e.g. Google Reviews (5.0 ★)" : "Link label (optional)"}
                            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                          />

                          <button
                            type="button"
                            onClick={() => handleDeleteSocial(soc.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={soc.url || ""}
                          onChange={(e) => handleUpdateSocial(soc.id, { url: e.target.value })}
                          placeholder={
                            soc.platform === "google_review"
                              ? "https://g.page/r/... (Google review link)"
                              : soc.platform === "whatsapp"
                              ? "https://wa.me/919876543210"
                              : "https://..."
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: THEME & VISUAL STYLING */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-400" />
                  <span>Choose Industry Template Family</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Switching template updates visual styling and accents while preserving all your entered content.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {Object.values(INDUSTRY_TEMPLATES).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateSwitch(tmpl.industry)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        profile.industry === tmpl.industry
                          ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/10"
                          : "border-white/10 bg-slate-900/60 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{tmpl.name}</span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: tmpl.defaultTheme.accentColor }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {tmpl.tagline}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color & Style Options */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Visual Customization</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Accent Color Hex
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={profile.themeConfig?.accentColor || "#3b82f6"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            themeConfig: { ...profile.themeConfig, accentColor: e.target.value },
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={profile.themeConfig?.accentColor || "#3b82f6"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            themeConfig: { ...profile.themeConfig, accentColor: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Avatar Shape
                    </label>
                    <select
                      value={profile.themeConfig?.avatarShape || "rounded"}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          themeConfig: { ...profile.themeConfig, avatarShape: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option value="circle">Circle</option>
                      <option value="rounded">Rounded Square</option>
                      <option value="squircle">Squircle</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* STICKY STEP NAVIGATION FOOTER */}
          <div className="shrink-0 flex flex-col gap-2 p-3 sm:px-6 sm:py-3.5 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl z-20">
            {/* Inline Footer Alerts for immediate visibility */}
            {planLimitError && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Free Plan Quota (1 Live Profile):</span> Another profile in your workspace is currently published. You can keep this as a draft, or replace the live profile with one click:
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 pl-6">
                  <button
                    type="button"
                    onClick={() => handlePublish({ unpublishOthers: true })}
                    disabled={isPublishing}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{isPublishing ? "Switching..." : "Unpublish Old Profile & Publish This One"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveDraft();
                      setPlanLimitError(false);
                    }}
                    disabled={isSaving}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Keep as Saved Draft
                  </button>
                </div>
              </div>
            )}

            {errorMessage && !planLimitError && (
              <div className="bg-red-500/15 border border-red-500/30 px-4 py-2 rounded-xl text-xs text-red-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-white p-1 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {saveMessage && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{saveMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveMessage(null)}
                  className="text-emerald-400 hover:text-white p-1 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Step</span>
                <span className="sm:hidden">Back</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Draft"}</span>
                  <span className="sm:hidden">{isSaving ? "..." : "Save"}</span>
                </button>

                {currentStep < ONBOARDING_STEPS.length ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.min(ONBOARDING_STEPS.length, prev + 1))}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline">Next: {ONBOARDING_STEPS[currentStep].shortTitle}</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublish()}
                    disabled={isPublishing}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{isPublishing ? "Publishing..." : "Finish & Publish Profile"}</span>
                    <span className="sm:hidden">{isPublishing ? "..." : "Publish"}</span>
                  </button>
                )}
              </div>
            </div>
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
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Live Public Preview</span>
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full border border-white/10">
                {profile.industry.replace("_", " ")}
              </span>
            </div>

            {/* Mobile Viewport Simulation Frame (Bordered on desktop, edge-to-edge on phone screen) */}
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
