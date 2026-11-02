"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  QrCode,
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
  Sun,
  Moon,
  Bookmark,
  Play,
  FileDown,
  ArrowUpDown,
  Sliders,
  Laptop,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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

  // Onboarding Step State
  const [currentStep, setCurrentStep] = useState(1);

  // Inline inputs state
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState("instagram");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Portfolio modal state for manual project addition
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    category: "Web Development",
    imageUrl: "",
    linkUrl: "",
    description: "",
  });

  // Theme simulator preview override
  const [previewThemeOverride, setPreviewThemeOverride] = useState<"dark" | "light" | null>(null);

  // Section Reorder Modal & Drag State
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);

  // Employee Profile Quick Creation Modal
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    whatsapp: "",
    department: "",
  });

  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [deleteProfileError, setDeleteProfileError] = useState<string | null>(null);

  const handleDeleteCurrentProfile = async () => {
    setIsDeletingProfile(true);
    setDeleteProfileError(null);
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete profile");
      }
      router.push("/dashboard/profiles");
    } catch (err: any) {
      setDeleteProfileError(err.message || "Failed to delete profile");
      setIsDeletingProfile(false);
    }
  };

  // Blocks accessor
  const blocks: ProfileBlockItem[] = profile.blocks || [];

  const updateColorMode = (colorMode: "dark" | "light" | "auto") => {
    setProfile((prev: any) => ({
      ...prev,
      themeConfig: {
        ...(prev.themeConfig || {}),
        colorMode,
      },
    }));
    setPreviewThemeOverride(colorMode === "auto" ? "dark" : colorMode);
  };

  const SECTION_METADATA: Record<string, { title: string; desc: string; icon: any; step: number }> = {
    social_links: { title: "Connect With Me & Socials", desc: "WhatsApp, Instagram, LinkedIn, Google Review", icon: Share2, step: 3 },
    about: { title: "About Me & Bio Narrative", desc: "Bio, story, highlights, and photo", icon: Bookmark, step: 4 },
    services: { title: "Services & Products", desc: "Offerings, pricing, and fast booking", icon: Briefcase, step: 5 },
    portfolio_gallery: { title: "Featured Portfolio", desc: "Selected projects & visual showcase", icon: Sparkles, step: 6 },
    intro_video: { title: "Introduction Video", desc: "Embedded video presentation", icon: Play, step: 4 },
    testimonials: { title: "Client Testimonials", desc: "Client reviews and ratings", icon: Star, step: 7 },
    certifications: { title: "Certifications & Awards", desc: "Credentials, licenses, and achievements", icon: Award, step: 7 },
    downloads: { title: "Downloads & Resources", desc: "PDF brochures, catalogs, and media kits", icon: FileDown, step: 8 },
    location: { title: "Business Location & Map", desc: "Google map link, address, and hours", icon: MapPin, step: 7 },
    faq: { title: "Frequently Asked Questions", desc: "Interactive FAQ accordion answers", icon: HelpCircle, step: 7 },
  };

  const orderedBlockTypes = useMemo(() => {
    const defaultList = [
      "social_links",
      "about",
      "services",
      "portfolio_gallery",
      "intro_video",
      "testimonials",
      "certifications",
      "downloads",
      "location",
      "faq",
    ];

    const existingSorted = [...blocks]
      .filter((b) => defaultList.includes(b.type))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((b) => b.type);

    const result: string[] = [];
    existingSorted.forEach((t) => {
      if (!result.includes(t)) result.push(t);
    });
    defaultList.forEach((t) => {
      if (!result.includes(t)) result.push(t);
    });
    return result;
  }, [blocks]);

  const applyNewSectionOrder = (newOrder: string[]) => {
    const existingBlocks = [...blocks];
    const updatedBlocks: ProfileBlockItem[] = [];

    newOrder.forEach((type, orderIndex) => {
      const existing = existingBlocks.find((b) => b.type === type);
      if (existing) {
        updatedBlocks.push({
          ...existing,
          sortOrder: orderIndex,
        });
      } else {
        updatedBlocks.push({
          id: `b_${type}_${Date.now()}_${orderIndex}`,
          type: type as any,
          isEnabled: true,
          sortOrder: orderIndex,
          blockData: {},
        });
      }
    });

    existingBlocks.forEach((b) => {
      if (!newOrder.includes(b.type)) {
        updatedBlocks.push(b);
      }
    });

    setProfile((prev: any) => ({
      ...prev,
      blocks: updatedBlocks,
    }));
  };

  const moveSection = (type: string, direction: "up" | "down") => {
    const currentList = [...orderedBlockTypes];
    const idx = currentList.indexOf(type);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;

    const swapped = [...currentList];
    const temp = swapped[idx];
    swapped[idx] = swapped[targetIdx];
    swapped[targetIdx] = temp;

    applyNewSectionOrder(swapped);
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    setDraggedBlockType(type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetType: string) => {
    e.preventDefault();
    if (!draggedBlockType || draggedBlockType === targetType) return;
    const currentList = [...orderedBlockTypes];
    const fromIndex = currentList.indexOf(draggedBlockType);
    const toIndex = currentList.indexOf(targetType);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...currentList];
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);

    applyNewSectionOrder(reordered);
    setDraggedBlockType(null);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.name.trim()) {
      setErrorMessage("Please enter the employee's full name.");
      return;
    }
    setIsCreatingEmployee(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: employeeFormData.name,
          title: employeeFormData.title,
          email: employeeFormData.email,
          phone: employeeFormData.phone,
          whatsapp: employeeFormData.whatsapp,
          department: employeeFormData.department,
          isEmployee: true,
        }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to create employee card");
      }
      setSaveMessage("Employee card created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = `/dashboard/profiles/${data.profile.id}/edit`;
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create employee profile");
    } finally {
      setIsCreatingEmployee(false);
    }
  };



  const getBlock = (type: string): any => {
    return blocks.find((b) => b.type === type) || { isEnabled: true, blockData: {} as any };
  };

  const isBlockEnabled = (blockType: string): boolean => {
    const found = blocks.find((b) => b.type === blockType);
    return found ? Boolean(found.isEnabled) : true;
  };

  const toggleBlockEnabled = (blockType: string) => {
    setProfile((prev: any) => {
      let exists = false;
      const currentBlocks = prev.blocks || [];
      const updated = currentBlocks.map((b: any) => {
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
      return { ...prev, blocks: updated };
    });
  };

  const updateBlockData = (
    blockType: string,
    newBlockData: Record<string, any>,
    extraProfileFields?: Record<string, any>
  ) => {
    setProfile((prev: any) => {
      let exists = false;
      const currentBlocks = prev.blocks || [];
      const updated = currentBlocks.map((b: any) => {
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
      return {
        ...prev,
        ...(extraProfileFields || {}),
        blocks: updated,
      };
    });
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
        updateBlockData("identity_header", { avatarUrl: compressedBase64, coverUrl: compressedBase64 });
      } else if (targetField === "coverUrl") {
        updateBlockData("identity_header", { coverUrl: compressedBase64, avatarUrl: compressedBase64 });
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

  // Project file upload & save handler for manual addition
  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.85 });
      setProjectFormData((prev) => ({ ...prev, imageUrl: base64 }));
    } catch (err: any) {
      setErrorMessage("Failed to process project image.");
    }
  };

  const handleSaveProject = () => {
    if (!projectFormData.title.trim()) {
      setErrorMessage("Please enter a project title.");
      return;
    }
    const finalImage = projectFormData.imageUrl.trim() || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80";
    let updated: any[];
    if (editingProjectIndex !== null && editingProjectIndex >= 0) {
      updated = [...portfolioList];
      updated[editingProjectIndex] = {
        ...updated[editingProjectIndex],
        ...projectFormData,
        imageUrl: finalImage,
      };
    } else {
      updated = [
        ...portfolioList,
        {
          id: `p_${Date.now()}`,
          ...projectFormData,
          imageUrl: finalImage,
        },
      ];
    }
    updateBlockData("portfolio_gallery", { items: updated });
    setShowProjectModal(false);
    setEditingProjectIndex(null);
    setProjectFormData({ title: "", category: "Web Development", imageUrl: "", linkUrl: "", description: "" });
    setSaveMessage("Project saved successfully!");
    setTimeout(() => setSaveMessage(null), 2500);
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

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        throw new Error(data.error || `Failed to save draft (Status: ${res.status})`);
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

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        if (res.status === 403 && data.code === "PLAN_LIMIT_EXCEEDED") {
          setPlanLimitError(true);
          throw new Error(data.error || "Plan published profiles limit reached.");
        }
        throw new Error(data.error || `Failed to publish profile (Status: ${res.status})`);
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
  const faqBlock: any = getBlock("faq").blockData || {};

  // Step-by-Step Completion Guide calculation (Safely defined after block references)
  const completionStats = useMemo(() => {
    const contact = contactBlock || {};
    const about = aboutBlock || {};
    const services = (servicesBlock?.services || servicesBlock?.items || []) as any[];
    const portfolio = (portfolioBlock?.items || []) as any[];
    const testimonials = (testimonialsBlock?.testimonials || testimonialsBlock?.items || []) as any[];
    const loc = locationBlock || {};
    const socials = (socialsBlock?.links || []) as any[];

    const stepChecks: Record<number, boolean> = {
      1: Boolean(profile.name && (profile.title || profile.bio)),
      2: Boolean(contact.phone || contact.email || contact.whatsapp || contact.websiteUrl),
      3: Boolean(socials.length > 0),
      4: Boolean(profile.bio || about.description || about.bio || about.content || about.imageUrl),
      5: Boolean(services.length > 0),
      6: Boolean(portfolio.length > 0),
      7: Boolean(testimonials.length > 0 || loc.address),
      8: Boolean(profile.templateId || profile.themeConfig?.accentColor),
    };

    const completedCount = Object.values(stepChecks).filter(Boolean).length;
    const percent = Math.round((completedCount / 8) * 100);

    return { completedCount, totalSteps: 8, percent, stepChecks };
  }, [profile, blocks, contactBlock, aboutBlock, servicesBlock, portfolioBlock, testimonialsBlock, locationBlock, socialsBlock]);

  // Resolved experience timeline
  const experienceTimeline: any[] = highlightsBlock.experienceTimeline || [
    { id: "exp1", role: "Founder & Lead Consultant", company: "Upmark Digital", period: "2018 - Present", description: "Leading digital strategy, AI-driven solutions and growth frameworks for 500+ clients." },
    { id: "exp2", role: "Senior Digital Marketing Specialist", company: "Apex Media", period: "2014 - 2018", description: "Managed enterprise marketing campaigns and client conversion pipelines." }
  ];

  // Resolved FAQs
  const faqList: any[] = faqBlock.items || [
    { id: "f1", question: "How do I save this profile or contact details?", answer: "Tap the 'Save Contact' button in the sticky action bar at the bottom of the screen. A standard .vcf contact card will download directly into your phone contacts without requiring an account." },
    { id: "f2", question: "Can I book a consultation or appointment directly?", answer: "Yes! Use the 'Book Appointment' button in the quick action buttons, or use the Inquiry Form at the bottom." },
    { id: "f3", question: "How does the Tapbez NFC digital card work?", answer: "Tapbez cards use encrypted contactless NFC technology. Simply tap against any modern smartphone to instantly share this complete digital profile and portfolio." }
  ];

  // Resolved social links
  const socialLinks: any[] = socialsBlock.links || [
    { id: "s1", platform: "website", url: "https://upmark.in", isEnabled: true },
    { id: "s2", platform: "instagram", url: "https://instagram.com/upmark.in", isEnabled: true },
    { id: "s3", platform: "linkedin", url: "https://www.linkedin.com/in/upmark", isEnabled: true },
  ];

  // Resolved stats
  const statsList: any[] = highlightsBlock.stats || [
    { id: "st1", label: "Years of Experience", value: "20+", icon: "briefcase" },
    { id: "st2", label: "Clients / Students", value: "500+", icon: "users" },
    { id: "st3", label: "Title / Founder Year", value: "2018", icon: "calendar" },
  ];

  // Resolved about tags
  const aboutTags: string[] = Array.isArray(aboutBlock.highlights) ? aboutBlock.highlights : [];

  // Resolved about headline and bio
  const rawAboutHeadline = aboutBlock.headline !== undefined ? aboutBlock.headline : (aboutBlock.title || "");
  const aboutHeadline = typeof rawAboutHeadline === "string" && rawAboutHeadline.trim().toLowerCase() === "gfgfgf" ? "" : (typeof rawAboutHeadline === "string" ? rawAboutHeadline : "");

  const rawAboutBio =
    aboutBlock.bio !== undefined
      ? aboutBlock.bio
      : aboutBlock.description !== undefined
      ? aboutBlock.description
      : aboutBlock.content !== undefined
      ? aboutBlock.content
      : profile.bio || "";
  const aboutBio = typeof rawAboutBio === "string" ? rawAboutBio : "";

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
    { id: 4, label: "About & Story", short: "About", icon: "📝", desc: "Bio narrative, headline & key highlights" },
    { id: 5, label: "Services & Products", short: "Services", icon: "💼", desc: "Service packages, pricing & descriptions" },
    { id: 6, label: "Featured Portfolio", short: "Portfolio", icon: "🎨", desc: "Project gallery, photos & video media" },
    { id: 7, label: "Reviews, FAQ & Map", short: "Reviews & FAQ", icon: "⭐", desc: "Client testimonials, FAQs & Google Map location" },
    { id: 8, label: "Theme, SEO & Files", short: "Theme & SEO", icon: "✨", desc: "Industry templates, colors, PDFs & SEO" },
  ];

  // =========================================================================
  // SECTION RENDERERS
  // =========================================================================

  // SECTION 1: PROFILE HEADER & IDENTITY
  const renderHeaderSection = (isFullWidth = false) => (
    <div id="profile-header" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            1
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Header & Branding</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Upload your banner, photo, and set your identity.</p>
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

      {/* Hero Profile Photo & Centered Company Logo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hero Profile Photo (Appears in background) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">Hero Profile Photo</span>
              <p className="text-[11px] text-slate-500">Appears in background as main hero portrait</p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs active:scale-95">
              <Camera className="w-3.5 h-3.5" />
              <span>{uploadingField === "avatarUrl" ? "Uploading..." : "Upload Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatarUrl")} />
            </label>
          </div>
          <div className="h-36 sm:h-40 w-full rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300/80">
            {headerBlock.avatarUrl || headerBlock.coverUrl ? (
              <img
                src={headerBlock.avatarUrl || headerBlock.coverUrl}
                alt="Profile Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-100">
                <ImageIcon className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-medium">No profile photo uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Brand / Company Logo (Appears centered over portrait) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">Company / Brand Logo</span>
              <p className="text-[11px] text-slate-500">Appears in center circular badge over portrait</p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors shadow-xs active:scale-95">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>{uploadingField === "companyLogoUrl" ? "Uploading..." : "Upload Logo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "companyLogoUrl")} />
            </label>
          </div>
          <div className="h-36 sm:h-40 w-full rounded-xl bg-white border border-slate-300/80 flex items-center justify-center p-3 relative">
            {headerBlock.logoUrl ? (
              <img
                src={headerBlock.logoUrl}
                alt="Company Logo"
                className="max-h-28 max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-xs font-medium text-slate-400">No logo uploaded (optional)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields: Spacious 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
          <input
            type="text"
            required
            value={headerBlock.name !== undefined ? headerBlock.name : profile.name}
            onChange={(e) => {
              const val = e.target.value;
              updateBlockData("identity_header", { name: val }, { name: val });
            }}
            placeholder="e.g. Rikesh Panchal"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Role *</label>
          <input
            type="text"
            value={headerBlock.title !== undefined ? headerBlock.title : profile.title || ""}
            onChange={(e) => {
              const val = e.target.value;
              updateBlockData("identity_header", { title: val }, { title: val });
            }}
            placeholder="e.g. Founder • Trainer • Consultant"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Company / Brand Name</label>
          <input
            type="text"
            value={headerBlock.company || ""}
            onChange={(e) => updateBlockData("identity_header", { company: e.target.value })}
            placeholder="e.g. Upmark Digital"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Company Tagline / Subtitle</label>
          <input
            type="text"
            value={headerBlock.badge || ""}
            onChange={(e) => updateBlockData("identity_header", { badge: e.target.value })}
            placeholder="e.g. Digital Marketing | Training | Consulting"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Short Value Proposition / Bio Quote</label>
          <textarea
            rows={2}
            value={headerBlock.valueProposition || ""}
            onChange={(e) => updateBlockData("identity_header", { valueProposition: e.target.value })}
            placeholder="Helping businesses grow with Digital Marketing, AI and practical training..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium resize-none"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Public Profile Link Slug</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 shrink-0">
              tapbez.in/p/
            </span>
            <input
              type="text"
              value={profile.slug || ""}
              onChange={(e) => setProfile({ ...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
              placeholder="your-unique-slug"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // SECTION 2: QUICK ACTION BUTTONS & CONTACT
  const renderQuickActionsSection = () => (
    <div id="sections" className="space-y-6">
      {/* SECTION ORDER MANAGER CARD (DRAG & DROP / UP-DOWN) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              <ArrowUpDown className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Sections Order (Drag & Drop / Up Down)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reorder sections on your public card. Changes preview in real-time.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReorderModal(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Full View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Order List */}
        <div className="space-y-2">
          {orderedBlockTypes.map((type, idx) => {
            const meta = SECTION_METADATA[type] || { title: type, desc: "", icon: Layers, step: 1 };
            const Icon = meta.icon;
            const isEnabled = isBlockEnabled(type);

            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, type)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  draggedBlockType === type
                    ? "opacity-50 border-blue-500 bg-blue-50"
                    : isEnabled
                    ? "bg-slate-50/80 hover:bg-slate-50 border-slate-200"
                    : "bg-slate-100/50 border-dashed border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{meta.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{meta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(type, "up")}
                    className="p-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === orderedBlockTypes.length - 1}
                    onClick={() => moveSection(type, "down")}
                    className="p-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBlockEnabled(type)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                      isEnabled
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isEnabled ? "Visible" : "Hidden"}
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(meta.step)}
                    className="text-[10px] text-blue-600 font-bold hover:underline px-1 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            2
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Action Buttons & Contact Info</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure phone call, WhatsApp, email, map, and meeting booking links.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Direct Call Phone */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Direct Call</span>
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
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        {/* WhatsApp Chat */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">WhatsApp Chat</span>
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
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Email Address</span>
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
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        {/* Map / Location */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Map Pin</span>
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
            placeholder="e.g. Ring Road, Surat, Gujarat"
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        {/* Book Appointment */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-600 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Appointment / Calendly Link</span>
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
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>
      </div>
    </div>
    </div>
  );

  // SECTION 3: SOCIAL MEDIA LINKS
  const renderSocialsSection = () => (
    <div id="socials" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            3
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Social Media & Important Links</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add verified handles for Instagram, YouTube, LinkedIn, Google Review, etc.</p>
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
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3">
        <span className="block text-xs font-bold text-slate-900 dark:text-white">Add New Social or Custom Link</span>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={selectedSocialPlatform}
            onChange={(e) => setSelectedSocialPlatform(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
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
            className="w-full flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
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
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize shrink-0 w-24 truncate">
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
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              4
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">About Me & Bio Narrative</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your professional background, credentials and skill tags.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Show Section</span>
            <input
              type="checkbox"
              checked={isBlockEnabled("about")}
              onChange={() => toggleBlockEnabled("about")}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Section Heading / Headline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Section Heading / Badge</label>
            <span className="text-[10px] text-slate-400">Shows in badge above your photo (leave blank to remove)</span>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={aboutHeadline}
              onChange={(e) => updateBlockData("about", { headline: e.target.value })}
              placeholder="e.g. About Me, Our Story (or leave blank to remove badge)"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium pr-10"
            />
            {aboutHeadline ? (
              <button
                type="button"
                onClick={() => updateBlockData("about", { headline: "" })}
                className="absolute right-3 p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Remove Heading"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* About Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">About Photo (800 × 600 px)</label>
            <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 overflow-hidden relative group flex items-center justify-center">
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">About Description</label>
              <span className="text-[10px] text-slate-400 font-mono">{aboutBio.length} / 500</span>
            </div>
            <textarea
              rows={6}
              value={aboutBio}
              onChange={(e) => {
                const val = e.target.value;
                updateBlockData(
                  "about",
                  { bio: val, description: val, content: val },
                  { bio: val }
                );
              }}
              placeholder="I'm a Digital Marketing Trainer, Consultant and Founder. I help businesses grow with practical digital strategies, AI tools and real-world implementation..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Key Skills / Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Key Skills & Specializations</label>
          <div className="flex flex-wrap items-center gap-2">
            {aboutTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs"
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
                  className="px-2.5 py-1 text-xs rounded-xl border border-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowTagInput(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="px-3 py-1.5 rounded-xl border border-dashed border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // SECTION 5: SERVICES & PRODUCTS
  const renderServicesSection = () => (
    <div id="services" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            5
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Services & Products</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Showcase your offerings, consulting packages, and digital solutions.</p>
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
                  className="w-full text-sm font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none focus:bg-white dark:focus:bg-slate-800 rounded-md px-1 transition-colors"
                />
                <input
                  type="text"
                  value={srv.description}
                  onChange={(e) => {
                    const updated = [...servicesList];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    updateBlockData("services", { items: updated });
                  }}
                  className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none focus:bg-white dark:focus:bg-slate-800 rounded-md px-1 transition-colors"
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
                className="w-28 text-right font-black text-blue-600 dark:text-blue-400 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
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
    <div id="portfolio" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            6
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Featured Work & Portfolio Gallery</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Display project images, case studies, or campaign designs.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProjectIndex(null);
            setProjectFormData({
              title: "",
              category: "Web Development",
              imageUrl: "",
              linkUrl: "",
              description: "",
            });
            setShowProjectModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {portfolioList.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group space-y-2 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-32 sm:h-36 bg-slate-200 overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                {/* Category Pill */}
                {item.category && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {item.category}
                  </span>
                )}

                {/* Edit & Delete Action Buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectIndex(idx);
                      setProjectFormData({
                        title: item.title || "",
                        category: item.category || "Web Development",
                        imageUrl: item.imageUrl || "",
                        linkUrl: item.linkUrl || "",
                        description: item.description || "",
                      });
                      setShowProjectModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-blue-600 text-white transition-colors cursor-pointer shadow-sm"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = portfolioList.filter((_, i) => i !== idx);
                      updateBlockData("portfolio_gallery", { items: updated });
                    }}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-sm"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-3 space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                )}
                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline pt-0.5"
                  >
                    <span>Visit Project</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal for Manual Project Addition */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProjectIndex !== null ? "Edit Project" : "Add New Project"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter project details, upload an image or paste a link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Project Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="e.g. Modern E-Commerce Platform"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Category / Tag</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Web Design", "Branding", "Social Media", "App Development", "Photography", "Case Study"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectFormData({ ...projectFormData, category: cat })}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        projectFormData.category === cat
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={projectFormData.category}
                  onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                  placeholder="Or type custom category tag"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              {/* Project Image */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Project Image *</label>
                
                {/* Image Preview */}
                <div className="h-36 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                  {projectFormData.imageUrl ? (
                    <img
                      src={projectFormData.imageUrl}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      <span className="text-xs">No project image selected</span>
                    </div>
                  )}
                </div>

                {/* Upload or URL options */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProjectFileUpload}
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-medium">or paste URL:</span>
                  <input
                    type="url"
                    value={projectFormData.imageUrl}
                    onChange={(e) => setProjectFormData({ ...projectFormData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Project URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Live Project URL (Optional)</label>
                <input
                  type="url"
                  value={projectFormData.linkUrl}
                  onChange={(e) => setProjectFormData({ ...projectFormData, linkUrl: e.target.value })}
                  placeholder="https://example.com/project"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              {/* Project Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Short Summary / Description</label>
                <textarea
                  rows={2}
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Briefly describe what this project was and results achieved..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                {editingProjectIndex !== null ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // SECTION 7: TESTIMONIALS & LOCATION MAP
  const renderTestimonialsAndMapSection = () => (
    <div id="testimonials" className="space-y-6">
      {/* Testimonials */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              7
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Client Testimonials & Reviews</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Build social proof with authentic client reviews and 5-star ratings.</p>
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
            <div key={t.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-2">
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
                      className="text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
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
                className="w-full text-xs text-slate-700 dark:text-slate-300 bg-transparent border-t border-slate-200/80 dark:border-white/10 pt-2 focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              ❓
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Frequently Asked Questions (FAQ)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Provide direct answers to frequent client questions, booking terms & inquiries.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newFaq = {
                id: `faq_${Date.now()}`,
                question: "New Frequently Asked Question?",
                answer: "Provide clear and concise answer here to help your clients understand your offerings.",
              };
              const updated = [...faqList, newFaq];
              updateBlockData("faq", { items: updated });
              setSaveMessage("FAQ item added!");
              setTimeout(() => setSaveMessage(null), 2000);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-3.5 pt-1">
          {faqList.map((faq: any, idx: number) => (
            <div
              key={faq.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Question #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = faqList.filter((_: any, i: number) => i !== idx);
                    updateBlockData("faq", { items: updated });
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Question *</label>
                <input
                  type="text"
                  value={faq.question || ""}
                  onChange={(e) => {
                    const updated = [...faqList];
                    updated[idx] = { ...updated[idx], question: e.target.value };
                    updateBlockData("faq", { items: updated });
                  }}
                  placeholder="e.g. How does your consulting process work?"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Answer *</label>
                <textarea
                  rows={2}
                  value={faq.answer || ""}
                  onChange={(e) => {
                    const updated = [...faqList];
                    updated[idx] = { ...updated[idx], answer: e.target.value };
                    updateBlockData("faq", { items: updated });
                  }}
                  placeholder="Type the detailed answer here..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Map & Contact Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-5 transition-colors">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            🎨
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Choose Industry Template Family</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switching template updates visual styling and accents while preserving all your content.</p>
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
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-white border-2 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="min-w-0 pr-3">
                  <p className={`text-sm font-bold truncate ${isSelected ? "text-blue-950 dark:text-white" : "text-slate-900 dark:text-white"}`}>
                    {tmpl.name}
                  </p>
                  <p className={`text-xs truncate ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"}`}>
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

        {/* Card Color Theme Mode (Dark & Light Mode) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Card Color Mode (Dark & Light Mode)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Choose default color scheme for your digital card & visitors</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Interactive
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "dark", label: "Dark Mode", desc: "AMOLED sleek dark (Default)", icon: Moon },
              { id: "light", label: "Light Mode", desc: "Crisp daytime high-contrast", icon: Sun },
              { id: "auto", label: "Visitor Auto", desc: "Matches visitor system theme", icon: Laptop },
            ].map((mode) => {
              const isSelected = ((profile.themeConfig as any)?.colorMode || "dark") === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => updateColorMode(mode.id as any)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/70 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{mode.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{mode.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Customization */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Accent Color & Avatar</h3>
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
      <div id="seo" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              🔍
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">SEO & Google Search Preview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control how your digital card appears when shared on WhatsApp and Google.</p>
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-xs p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              📁
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Downloads & PDF Documents</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allow visitors to download your catalog, menu or corporate profile.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {downloadsList.map((dl, i) => (
            <div key={dl.id || i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
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

      {/* Danger Zone: Delete Profile */}
      <div className="bg-red-50/70 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-500/20 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
              <Trash2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-red-900 dark:text-red-300">Danger Zone: Delete Profile</h2>
              <p className="text-xs text-red-700/80 dark:text-red-400">
                Permanently delete this digital card. This immediately frees up 1 slot in your subscription quota.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteProfileError(null);
              setShowDeleteModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen overflow-hidden bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-100 transition-colors">
      {/* ============================================================== */}
      {/* 1. TOP HEADER BAR (COMPACT & FIXED)                            */}
      {/* ============================================================== */}
      <header className="shrink-0 bg-white dark:bg-[#0a0f1d] border-b border-slate-200/90 dark:border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs z-30 transition-colors">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Edit Profile</span>
              <Link
                href="/dashboard/profiles"
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
                title="View and switch between all digital profiles"
              >
                <span>All Profiles</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Manage your mobile-first digital business card content and styling.
            </p>
          </div>

          {/* Public Profile Link Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 max-w-[200px] sm:max-w-[240px]">
            <span className="truncate">{getPublicUrl()}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-0.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle size="sm" />

          {/* Dedicated Add Employee Profile Button */}
          <button
            type="button"
            onClick={() => setShowEmployeeModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Add an employee profile inheriting company branding"
          >
            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">+ Employee Card</span>
          </button>

          {/* New Profile Button */}
          <Link
            href="/dashboard/profiles/new"
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Create another digital profile under your plan"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">New Profile</span>
          </Link>

          {/* View Live Profile Button */}
          <Link
            href={`/p/${profile.slug}`}
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">View Live</span>
          </Link>

          {/* QR Code Quick Modal Button */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Scan QR to open profile"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {saveMessage && (
        <div className="shrink-0 bg-emerald-50 border-b border-emerald-200 px-6 py-1.5 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="shrink-0 bg-red-50 border-b border-red-200 px-6 py-1.5 text-xs text-red-800 font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {planLimitError && (
            <Link href="/dashboard/billing" className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-bold">
              Upgrade Plan
            </Link>
          )}
        </div>
      )}

      {/* PERSISTENT STEPPER NAVIGATION BAR (ONBOARDING MODE) */}
      <div className="shrink-0 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/10 px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-20 shadow-xs transition-colors">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 shrink-0">
            Step {currentStep} of {STEPS.length}
          </span>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
              {STEPS[currentStep - 1].label}
            </span>
          </div>

          {/* Step Completion Score */}
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{completionStats.percent}% Setup Complete</span>
            <div className="w-12 bg-emerald-200/60 h-1.5 rounded-full overflow-hidden shrink-0">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionStats.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stepper Nav Quick Pills & Reorder Trigger */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setShowReorderModal(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer shadow-2xs"
            title="Reorder profile sections (Drag & Drop or Move Up/Down)"
          >
            <ArrowUpDown className="w-3 h-3 text-amber-600" />
            <span>Reorder Sections</span>
          </button>

          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            const isCompleted = completionStats.stepChecks[s.id];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToStep(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                title={s.label}
              >
                <span className="text-[10px]">{isCompleted ? "✓" : s.id}</span>
                <span>{s.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE SWITCHER TAB */}
      <div className="md:hidden shrink-0 flex border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1d] p-1">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === "editor" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
          }`}
        >
          Section Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === "preview" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
          }`}
        >
          Live Simulator
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE: LEFT EDITOR + RIGHT LIVE SIMULATOR          */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT/CENTER EDITOR */}
        <div
          className={`flex-1 flex flex-col min-h-0 overflow-hidden ${
            mobileTab === "editor" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* ============================================================ */}
          {/* ONBOARDING STEP-BY-STEP DESKTOP EXPERIENCE                   */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50 dark:bg-[#07090e] transition-colors">
            {/* Active Step Form: Scrollable inside only */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 scrollbar-thin">
              <div className="max-w-2xl mx-auto space-y-4">
                {currentStep === 1 && renderHeaderSection(true)}
                {currentStep === 2 && renderQuickActionsSection()}
                {currentStep === 3 && renderSocialsSection()}
                {currentStep === 4 && renderAboutAndStatsSection()}
                {currentStep === 5 && renderServicesSection()}
                {currentStep === 6 && renderPortfolioSection()}
                {currentStep === 7 && renderTestimonialsAndMapSection()}
                {currentStep === 8 && renderAppearanceAndSeoSection()}
              </div>
            </div>

            {/* PINNED BOTTOM STEPPER CONTROLS BAR: ALWAYS IN SIGHT! */}
            <div className="shrink-0 bg-white dark:bg-[#0a0f1d] border-t border-slate-200/90 dark:border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg z-20 transition-colors">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => goToStep(Math.max(1, currentStep - 1))}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:block">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveDraft();
                      goToStep(Math.min(STEPS.length, currentStep + 1));
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer transition-all"
                  >
                    <span>Save & Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/25 cursor-pointer transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{isPublishing ? "Publishing..." : "Finish & Publish"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: REALISTIC LIVE PREVIEW (MOBILE SIMULATOR)       */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-[370px] lg:w-[390px] xl:w-[420px] shrink-0 bg-slate-100 dark:bg-[#0a0f1d] border-l border-slate-200 dark:border-white/5 p-3 flex flex-col items-center justify-center overflow-hidden min-h-0 transition-colors ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Simulator Device Switcher */}
          <div className="w-full max-w-[320px] flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-2 px-1 shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
              <span>Live Preview</span>
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  previewDevice === "mobile" ? "bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  previewDevice === "tablet" ? "bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  previewDevice === "desktop" ? "bg-blue-600 text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3 h-3" />
              </button>
              <div className="h-3.5 w-px bg-slate-300 dark:bg-white/15 mx-0.5" />
              {/* Simulator Preview Dark / Light Theme Toggle */}
              <button
                type="button"
                onClick={() =>
                  setPreviewThemeOverride((prev) =>
                    (prev || ((profile.themeConfig as any)?.colorMode === "light" ? "light" : "dark")) === "light"
                      ? "dark"
                      : "light"
                  )
                }
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  (previewThemeOverride || ((profile.themeConfig as any)?.colorMode === "light" ? "light" : "dark")) === "light"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-slate-800 text-slate-200 border border-slate-700 hover:text-white"
                }`}
                title="Toggle Live Simulator between Dark and Light mode"
              >
                {(previewThemeOverride || ((profile.themeConfig as any)?.colorMode === "light" ? "light" : "dark")) === "light" ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-blue-400" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* REALISTIC SMARTPHONE BEZEL FRAME (FIT EXACTLY IN VIEWPORT) */}
          <div className="phone-mockup-frame w-full max-w-[320px] h-full max-h-[calc(100vh-130px)] aspect-[9/18.5] rounded-[38px] p-2 bg-slate-950 border-[5px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden shrink min-h-0">
            {/* iPhone Top Notch / Speaker Slit */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-3.5 rounded-full bg-black z-30 flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Status Bar */}
            <div className="pt-1 px-5 pb-1 flex items-center justify-between text-[10px] font-semibold text-white/90 z-20 relative select-none shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px]">5G</span>
                <div className="w-4 h-2 rounded-2xs border border-white/80 p-0.5 flex items-center">
                  <div className="w-full h-full bg-white rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Scrollable Mobile Viewport */}
            <div className="w-full flex-1 rounded-[26px] overflow-hidden overflow-y-auto scrollbar-none min-h-0">
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
                previewTheme={
                  previewThemeOverride ||
                  ((profile.themeConfig as any)?.colorMode === "light" ? "light" : "dark")
                }
              />
            </div>

            {/* Home indicator bar */}
            <div className="w-24 h-1 rounded-full bg-white/40 my-1 mx-auto shrink-0" />
          </div>
        </div>
      </div>

      {/* Modal 1: Reorder Profile Sections (Drag & Drop / Up Down) */}
      {showReorderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <ArrowUpDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reorder Profile Sections</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Drag & drop or use ▲ / ▼ to reorder blocks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReorderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {orderedBlockTypes.map((type, idx) => {
                const meta = SECTION_METADATA[type] || { title: type, desc: "", icon: Layers, step: 1 };
                const Icon = meta.icon;
                const isEnabled = isBlockEnabled(type);

                return (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, type)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      draggedBlockType === type
                        ? "opacity-50 border-blue-500 bg-blue-50"
                        : isEnabled
                        ? "bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
                        : "bg-slate-100/50 border-dashed border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{meta.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{meta.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(type, "up")}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderedBlockTypes.length - 1}
                        onClick={() => moveSection(type, "down")}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBlockEnabled(type)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          isEnabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isEnabled ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  setShowReorderModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Apply & Save Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Quick Add Employee Profile Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Employee Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Business Pro includes 25 digital profile slots</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmployeeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-2.5 text-xs text-teal-800">
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Inherits company logo, theme & styling automatically from this card.</span>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Role / Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales Executive"
                    value={employeeFormData.title}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales / Marketing"
                    value={employeeFormData.department}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Direct Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={employeeFormData.phone}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={employeeFormData.whatsapp}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Work Email</label>
                <input
                  type="email"
                  placeholder="employee@company.com"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingEmployee}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingEmployee ? "Creating..." : "Create Employee Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900">Profile QR Code</h3>
                <p className="text-[11px] text-slate-500">Scan to view digital profile instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center py-2">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(getPublicUrl())}`}
                  alt="Profile QR Code"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-xs font-bold text-slate-800">{profile.name}</p>
              <p className="text-[11px] text-blue-600 font-mono truncate">{getPublicUrl()}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(getPublicUrl())}`}
                download={`qr_${profile.slug || "profile"}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 text-center cursor-pointer"
              >
                Download PNG
              </a>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       {/* DELETE CURRENT PROFILE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Delete Profile &apos;{profile.name}&apos;?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This action is permanent and frees up 1 slot in your subscription quota.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/5 space-y-1.5">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {profile.name}
              </div>
              <div className="text-xs font-mono text-teal-600 dark:text-teal-400 truncate">
                /p/{profile.slug}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Status: <span className="font-semibold capitalize">{profile.status}</span>
              </div>
            </div>

            {deleteProfileError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-xs text-red-600 dark:text-red-400">
                {deleteProfileError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteProfileError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={handleDeleteCurrentProfile}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingProfile ? "Deleting..." : "Yes, Delete Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}