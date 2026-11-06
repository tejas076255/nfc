"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Share2,
  Zap,
  ShieldCheck,
  Layers,
  Users,
  QrCode,
  Phone,
  Mail,
  MessageSquare,
  Building,
  ChevronDown,
  Briefcase,
  Palette,
  CreditCard,
  ExternalLink,
  Globe,
  MapPin,
  Upload,
  X,
  Menu,
  Award,
  TrendingUp,
  UserCheck,
  Eye,
  Radio,
  Wifi,
} from "lucide-react";

interface TapbezLandingProps {
  sessionUser?: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
  } | null;
}

// ----------------- DATA DEFINITIONS -----------------

const SITE_DATA = {
  name: "Tapbez",
  tagline: "Your Business. One Smart Card.",
  currency: "₹",
  announcement: "Smart NFC Business Cards Starting at ₹999",
  whatsappNumber: "919999999999", // Can be configured
};

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "NFC Cards", href: "#cards" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Digital Profile", href: "#digital-profile" },
  { label: "For Teams", href: "#for-teams" },
  { label: "FAQs", href: "#faqs" },
];

const PRODUCTS = [
  {
    id: "standard",
    name: "Standard PVC NFC Card",
    price: 999,
    priceLabel: "₹999",
    description: "Simple. Smart. Professional.",
    image: "/landing/card-standard.jpg",
    imageAlt: "Standard white PVC NFC business card",
    features: [
      "NFC-enabled PVC card",
      "Standard design selection",
      "Linked digital business profile",
      "Tap-to-share functionality",
      "QR sharing option",
    ],
    cta: "Choose Standard",
    orderVariant: "standard_pvc",
    badge: null,
    recommended: false,
  },
  {
    id: "custom-pvc",
    name: "Customized PVC NFC Card",
    price: 1499,
    priceLabel: "₹1,499",
    description: "Your brand. Your identity. Your smart card.",
    image: "/landing/card-custom-pvc.jpg",
    imageAlt: "Customized PVC NFC business card with company branding",
    features: [
      "NFC-enabled PVC card",
      "Personalized name and branding",
      "Custom logo and artwork",
      "Digital business profile",
      "Tap and QR sharing",
    ],
    cta: "Customize My Card",
    orderVariant: "matte_pvc",
    badge: "Recommended",
    recommended: true,
  },
  {
    id: "metal",
    name: "Customized Metal NFC Card",
    price: 1999,
    priceLabel: "₹1,999",
    description: "Make a premium first impression.",
    image: "/landing/card-metal.jpg",
    imageAlt: "Premium champagne-gold metal NFC business card",
    features: [
      "Premium metal card",
      "Custom branding",
      "NFC-enabled sharing",
      "Digital business profile",
      "Premium product presentation",
    ],
    cta: "Explore Metal Card",
    orderVariant: "matte_pvc",
    badge: null,
    recommended: false,
  },
];

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Choose Your Card",
    description: "Select your preferred NFC card and customize it with your design.",
    icon: CreditCard,
  },
  {
    number: "02",
    title: "Set Up Your Digital Profile",
    description: "Add your contact details, social links, portfolio, and company branding.",
    icon: Smartphone,
  },
  {
    number: "03",
    title: "Tap to Connect",
    description: "Tap against any smartphone to share your profile instantly with no app needed.",
    icon: Radio,
  },
];

const PERSONAS = [
  {
    id: "owner",
    label: "Business Owner",
    name: "Rajat Malhotra",
    designation: "Founder & CEO",
    company: "Malhotra Interiors",
    intro: "Designing modern commercial and residential spaces across India.",
    services: ["Interior Design", "Turnkey Projects", "Space Planning"],
  },
  {
    id: "realestate",
    label: "Real Estate Consultant",
    name: "Priya Sharma",
    designation: "Senior Property Consultant",
    company: "Skyline Realty",
    intro: "Helping families find premium homes and investment properties.",
    services: ["Residential Sales", "Commercial Leasing", "Investment Advisory"],
  },
  {
    id: "marketing",
    label: "Digital Marketer",
    name: "Arjun Nair",
    designation: "Performance Marketing Lead",
    company: "GrowthLabs Media",
    intro: "Scaling brands with paid media, funnels and conversion strategy.",
    services: ["Paid Campaigns", "SEO & Content", "Marketing Analytics"],
  },
  {
    id: "beauty",
    label: "Beauty Professional",
    name: "Meera Kapoor",
    designation: "Bridal Makeup Artist",
    company: "Meera Kapoor Studio",
    intro: "Bridal and editorial makeup for your most photographed days.",
    services: ["Bridal Makeup", "Party Styling", "Hair Styling"],
  },
  {
    id: "executive",
    label: "Corporate Executive",
    name: "Karan Desai",
    designation: "Regional Sales Director",
    company: "Vertex Solutions",
    intro: "Leading enterprise sales relationships across western India.",
    services: ["Enterprise Sales", "Partnerships", "Client Success"],
  },
];

const CARD_STYLES = [
  {
    id: "corporate",
    label: "Minimal Corporate",
    cardClass: "bg-white text-slate-900 border border-slate-200 shadow-xl",
    accentClass: "bg-[#00b39d]",
    nameClass: "text-slate-900",
    titleClass: "text-slate-500",
    badgeClass: "bg-slate-100 text-slate-700",
  },
  {
    id: "bold",
    label: "Bold Personal Branding",
    cardClass: "bg-[#0b182d] text-white border border-slate-800 shadow-2xl",
    accentClass: "bg-[#00b39d]",
    nameClass: "text-white",
    titleClass: "text-slate-400",
    badgeClass: "bg-slate-800 text-slate-200",
  },
  {
    id: "gold",
    label: "Metallic Luxury",
    cardClass: "bg-gradient-to-br from-[#1c1813] via-[#0d121c] to-[#251e15] text-amber-100 border border-amber-500/40 shadow-2xl",
    accentClass: "bg-amber-400",
    nameClass: "text-amber-100",
    titleClass: "text-amber-300/70",
    badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
];

const COMPARISON_ROWS = [
  {
    label: "Card material",
    values: { standard: "PVC", "custom-pvc": "PVC", metal: "Metal" },
  },
  {
    label: "Design",
    values: {
      standard: "Standard design selection",
      "custom-pvc": "Fully custom design",
      metal: "Fully custom design",
    },
  },
  {
    label: "Logo personalization",
    values: { standard: false, "custom-pvc": true, metal: true },
  },
  {
    label: "Digital business profile",
    values: { standard: true, "custom-pvc": true, metal: true },
  },
  {
    label: "NFC sharing",
    values: { standard: true, "custom-pvc": true, metal: true },
  },
  {
    label: "QR sharing",
    values: { standard: true, "custom-pvc": true, metal: true },
  },
  {
    label: "Intended buyer",
    values: {
      standard: "Everyday networking",
      "custom-pvc": "Professionals building a brand",
      metal: "Premium first impressions",
    },
  },
];

const INTRODUCTION_FEATURES = [
  {
    icon: Zap,
    title: "Instant Contact Sharing",
    description: "Share professional details with one tap on any modern smartphone.",
  },
  {
    icon: Smartphone,
    title: "Editable Digital Profile",
    description: "Update your information anytime without reprinting the card.",
  },
  {
    icon: Briefcase,
    title: "Showcase Your Work",
    description: "Share services, portfolio projects, client testimonials and PDFs.",
  },
  {
    icon: Award,
    title: "Professional Branding",
    description: "Present a consistent, high-tech, and credible business identity.",
  },
  {
    icon: Users,
    title: "Multiple Ways to Connect",
    description: "Give contacts easy access to direct calls, WhatsApp, email and social profiles.",
  },
  {
    icon: Globe,
    title: "Designed for Modern Networking",
    description: "Built for meetings, exhibitions, trade fairs, client visits and daily pitching.",
  },
];

const PROFESSIONS = [
  {
    title: "Entrepreneurs",
    description: "Pitch your venture, share your deck link and connect instantly at any event.",
  },
  {
    title: "Sales Professionals",
    description: "Follow up faster — prospects open your catalog and contact details in one tap.",
  },
  {
    title: "Real Estate Consultants",
    description: "Share property listings, contact details and your portfolio instantly.",
  },
  {
    title: "Doctors & Healthcare",
    description: "Share clinic details, timings and appointment links without printing new cards.",
  },
  {
    title: "Beauty & Wellness",
    description: "Show your work, price list and booking links with a single tap.",
  },
  {
    title: "Digital Marketers",
    description: "Link your case studies, campaigns and social profiles in one smart card.",
  },
  {
    title: "Coaches & Trainers",
    description: "Send clients straight to your programs, testimonials and booking page.",
  },
  {
    title: "Corporate Teams",
    description: "Onboard every employee with branded cards and centrally managed profiles.",
  },
];

const BULK_QUANTITIES = ["10 Cards", "25 Cards", "50 Cards", "100 Cards", "500+ Cards"];

const TEAM_BENEFITS = [
  "Bulk card orders with volume pricing",
  "Corporate logo & exact color branding",
  "Employee-specific digital profiles",
  "Centralized company administration",
  "Fast new employee onboarding",
  "Scalable enterprise team management",
];

const FAQS = [
  {
    question: "What is an NFC business card?",
    answer:
      "An NFC business card looks like a regular card but carries a small NFC chip. When someone taps it against their smartphone, your digital business profile opens instantly — no typing, no searching, no app.",
  },
  {
    question: "How does an NFC card work?",
    answer:
      "Your card stores a link to your digital profile. When it is tapped on a compatible smartphone, the phone reads the card and opens your profile in the browser. You can also share the same profile through its unique link or QR code.",
  },
  {
    question: "Does the other person need an app?",
    answer:
      "No. The person receiving your details does not need any app. Modern smartphones open NFC links directly in their default browser when the card is tapped.",
  },
  {
    question: "Can I update my contact details later?",
    answer:
      "Yes. Your digital profile is editable, so you can update your phone number, role, links, photos and services anytime — the physical card keeps working without reprinting.",
  },
  {
    question: "What happens if someone's phone does not support NFC?",
    answer:
      "Every Tapbez card also carries a high-contrast QR code and a unique profile link, so anyone can open your profile by simply scanning the card camera or clicking the link.",
  },
  {
    question: "Can I add WhatsApp and social media links?",
    answer:
      "Yes. Your digital profile supports direct call, WhatsApp, email, website and social media links, along with your services, portfolio, Google Map location, and vCard download.",
  },
  {
    question: "Can I customize my card with my company logo?",
    answer:
      "Yes. The customized PVC and metal cards support your full logo, name, designation and company branding. The standard card uses a clean, minimalist design.",
  },
  {
    question: "Can I order NFC cards for my employees?",
    answer:
      "Yes. Tapbez supports bulk corporate orders with branded cards and employee-specific digital profiles. You can request a corporate quote directly from the For Teams section.",
  },
  {
    question: "How do I activate my NFC card?",
    answer:
      "Set up your digital profile once in your Tapbez dashboard, and your card is linked and ready to tap right out of the box. Simple instructions are also included inside your package.",
  },
  {
    question: "Is there any subscription or renewal fee?",
    answer:
      "Tapbez includes standard digital profile hosting with your card purchase. Lifetime access with premium analytics, team dashboards, and custom domains are available for professionals.",
  },
  {
    question: "What is the expected delivery time?",
    answer:
      "Orders are typically manufactured and dispatched within 2–3 business days. Delivery across major metro cities in India takes 3–5 business days with live courier tracking.",
  },
  {
    question: "What happens if my card is lost?",
    answer:
      "Because the physical card only stores your secure profile link, your sensitive details remain protected in the cloud. You can temporarily disable the profile or order a replacement card easily.",
  },
];

// ----------------- MAIN VIEW COMPONENT -----------------

export function TapbezLovableLanding({ sessionUser }: TapbezLandingProps) {
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);

  // Persona switcher state
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);

  // Customizer state
  const [cardStyleIdx, setCardStyleIdx] = useState(0);
  const [customName, setCustomName] = useState("Your Name");
  const [customDesignation, setCustomDesignation] = useState("Your Designation");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Corporate quote state
  const [selectedQuantity, setSelectedQuantity] = useState("25 Cards");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteCompany, setQuoteCompany] = useState("");
  const [quoteContact, setQuoteContact] = useState("");
  const [quoteMobile, setQuoteMobile] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteCardType, setQuoteCardType] = useState("Customized PVC");
  const [quoteRequirements, setQuoteRequirements] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowBottomBar(window.scrollY > 480);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activePersona = PERSONAS[activePersonaIdx] || PERSONAS[0];
  const activeCardStyle = CARD_STYLES[cardStyleIdx] || CARD_STYLES[0];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomLogoUrl(url);
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCompany.trim() || !quoteContact.trim() || !quoteMobile.trim()) {
      setQuoteError("Please fill out Company, Contact Name and Mobile number.");
      return;
    }
    setQuoteError("");
    setQuoteSubmitted(true);
    // Construct WhatsApp message URL
    const message = encodeURIComponent(
      `Hello Tapbez team,\n\nI would like to request a Corporate Quote:\n- Company: ${quoteCompany}\n- Contact: ${quoteContact}\n- Mobile: ${quoteMobile}\n- Email: ${quoteEmail}\n- Quantity: ${selectedQuantity}\n- Card Type: ${quoteCardType}\n- Notes: ${quoteRequirements}`
    );
    // After 1.5 seconds, redirect or open WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/919999999999?text=${message}`, "_blank");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0b182d] selection:bg-[#00b39d]/20 selection:text-[#0b182d] font-sans antialiased" id="home">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#0b182d] text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-sm flex items-center justify-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00b39d] animate-pulse"></span>
          <span>{SITE_DATA.announcement}</span>
          <span className="hidden sm:inline text-slate-400 font-normal">| Free Shipping Across India</span>
        </div>
      </div>

      {/* 2. STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
            : "border-b border-transparent bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="#home" className="inline-flex items-center gap-2" aria-label="Tapbez home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landing/tapbez-logo-header.png"
              alt="Tapbez logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#00b39d]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            {sessionUser ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
              >
                <UserCheck className="h-4 w-4 text-[#00b39d]" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 transition hover:text-[#00b39d] px-3 py-2"
              >
                Sign In
              </Link>
            )}

            <a
              href="#cards"
              className="inline-flex items-center justify-center rounded-xl bg-[#00b39d] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#009c88] hover:shadow-md"
            >
              Design Your NFC Card
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-5 shadow-xl lg:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#00b39d]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                {sessionUser ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-800"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700"
                  >
                    Sign In
                  </Link>
                )}
                <a
                  href="#cards"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-[#00b39d] py-3 text-sm font-bold text-white shadow"
                >
                  Design Your NFC Card
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#00b39d]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00b39d]/30 bg-[#00b39d]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#009c88]">
              <Sparkles className="h-3.5 w-3.5 text-[#00b39d]" />
              The Future of Professional Networking
            </p>

            <h1 className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-[#0b182d] sm:text-5xl lg:text-6xl">
              Your Next Connection Starts With a Tap.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Share your contact details, portfolio, services and professional identity instantly with
              one smart NFC business card.
            </p>

            <p className="mt-4 text-xl font-bold text-[#0b182d] flex items-center gap-2">
              <span className="text-slate-500 font-medium text-base">Starting at</span>
              <span className="text-[#00b39d] text-2xl font-extrabold">₹999</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Zero Monthly Fees
              </span>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cards"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00b39d] px-7 text-base font-bold text-white shadow-lg shadow-[#00b39d]/25 transition hover:bg-[#009c88] hover:-translate-y-0.5"
              >
                Design Your NFC Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Radio className="mr-2 h-4 w-4 text-[#00b39d]" />
                Watch How It Works
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-[#00b39d] shrink-0" />
              No app required for the person receiving your details. Works with iPhone & Android.
            </p>
          </div>

          {/* Hero Composition Image with Floating Ping Badge */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landing/hero-composition.jpg"
                alt="Tapbez NFC business cards — matte black, white PVC and gold metal cards beside a smartphone showing a digital business profile"
                width={1024}
                height={1024}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>

            {/* Live Pop-in Pill */}
            <div className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-bold text-slate-800 shadow-xl backdrop-blur sm:left-4 sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b39d] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00b39d]"></span>
              </span>
              <span>Profile shared — contact saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NFC CARDS COLLECTION */}
      <section id="cards" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">
            Card Hardware Collection
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
            Choose the Card That Matches Your Style
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            From everyday networking to premium first impressions.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                product.recommended
                  ? "border-[#00b39d] ring-2 ring-[#00b39d]/20 shadow-xl"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {product.badge && (
                <span className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-[#00b39d] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {product.badge}
                </span>
              )}

              <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#0b182d]">{product.name}</h3>
                  <span className="font-display text-2xl font-black text-[#00b39d]">
                    {product.priceLabel}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">{product.description}</p>

                <div className="my-6 border-t border-slate-100" />

                <ul className="mb-8 flex flex-col gap-3 text-sm text-slate-600 flex-1">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-[#00b39d]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/orders/new?variant=${product.orderVariant}`}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl text-base font-bold transition ${
                    product.recommended
                      ? "bg-[#00b39d] text-white shadow-md hover:bg-[#009c88]"
                      : "bg-[#0b182d] text-white hover:bg-slate-800"
                  }`}
                >
                  {product.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-white py-16 border-y border-slate-200/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Zero Friction</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              Three Simple Steps. Unlimited Connections.
            </h2>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-14">
            {/* Visual Demo */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/tap-demo.jpg"
                  alt="A matte black NFC business card being tapped against the back of a smartphone, opening the owner's digital profile"
                  width={1024}
                  height={1024}
                  className="w-full object-cover"
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute right-6 top-6 flex h-4 w-4 animate-ping rounded-full bg-[#00b39d] opacity-50"
              />

              <div className="absolute bottom-6 left-6 rounded-full bg-[#0b182d]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
                Tap → profile opens instantly
              </div>
            </div>

            {/* Step list */}
            <div className="flex flex-col gap-5">
              {HOW_IT_WORKS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-[#faf9f6] p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00b39d]/10">
                      <IconComponent className="h-6 w-6 text-[#00b39d]" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold tracking-wider text-[#00b39d]">
                        STEP {step.number}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-bold text-[#0b182d]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIGITAL PROFILE SHOWCASE */}
      <section id="digital-profile" className="scroll-mt-20 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">
              Live Profile Preview
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              More Than a Business Card. Your Complete Digital Identity.
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              See how your profile looks for different professionals — switch personas below.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[1fr_360px] lg:gap-16">
            {/* Left Controls & Feature list */}
            <div>
              {/* Persona Tab Switcher */}
              <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-200/60 p-1.5">
                {PERSONAS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePersonaIdx(idx)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                      idx === activePersonaIdx
                        ? "bg-white text-[#0b182d] shadow-md"
                        : "text-slate-600 hover:text-[#0b182d]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Profile Feature Bullets */}
              <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  "Profile photo, name and designation",
                  "Company name and verified logo",
                  "Short professional introduction & bio",
                  "Save Contact, Call, WhatsApp and Email actions",
                  "Website, social links and Google map location",
                  "Services, portfolio gallery and testimonials",
                  "Built-in lead capture contact enquiry form",
                  "Always editable in real-time — zero reprinting",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#00b39d]" />
                    <span className="text-slate-700 font-medium">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#cards"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00b39d] px-7 text-base font-bold text-white shadow-lg shadow-[#00b39d]/20 transition hover:bg-[#009c88]"
                >
                  Create Your Smart Identity
                </a>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Try Free Profile
                </Link>
              </div>
            </div>

            {/* Right Phone Mockup (Interactive Persona) */}
            <div className="mx-auto w-full max-w-[340px]">
              <div className="rounded-[3rem] border-4 border-slate-800 bg-[#0b182d] p-3 shadow-2xl">
                {/* Dynamic Island */}
                <div className="relative h-[620px] overflow-y-auto rounded-[2.3rem] bg-[#0b182d] text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="sticky top-2 z-20 flex justify-center">
                    <div className="h-4 w-24 rounded-full bg-slate-900 shadow-sm" />
                  </div>

                  {/* Header Gradient */}
                  <div className="h-28 bg-gradient-to-br from-[#00b39d]/80 via-teal-700/40 to-slate-900" />

                  <div className="px-5 pb-6">
                    {/* Avatar & Company Pill */}
                    <div className="-mt-12 flex items-end gap-3">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#0b182d] bg-[#00b39d] font-display text-2xl font-bold text-white shadow-lg">
                        {activePersona.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="pb-1">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/90 px-2.5 py-1 text-[11px] font-bold text-slate-200">
                          <span className="h-2 w-2 rounded-sm bg-[#00b39d]" />
                          {activePersona.company}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-white">
                      {activePersona.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#00b39d]">
                      {activePersona.designation}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {activePersona.intro}
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-xl bg-slate-800/80 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        <Phone className="h-4 w-4 text-[#00b39d]" />
                        Call
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-xl bg-slate-800/80 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        <MessageSquare className="h-4 w-4 text-[#00b39d]" />
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1 rounded-xl bg-slate-800/80 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-700"
                      >
                        <Mail className="h-4 w-4 text-[#00b39d]" />
                        Email
                      </button>
                    </div>

                    {/* Save Contact CTA */}
                    <button
                      type="button"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b39d] py-2.5 text-xs font-bold text-white shadow"
                    >
                      <UserCheck className="h-4 w-4" />
                      Save Contact (vCard)
                    </button>

                    {/* Services Tags */}
                    <div className="mt-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Specialties & Services
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activePersona.services.map((srv) => (
                          <span
                            key={srv}
                            className="rounded-lg bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-700"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links list */}
                    <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2 rounded-lg bg-slate-800/40 p-2">
                        <Globe className="h-3.5 w-3.5 text-[#00b39d]" />
                        <span>{activePersona.company.toLowerCase().replace(/\s/g, "")}.com</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-800/40 p-2">
                        <MapPin className="h-3.5 w-3.5 text-[#00b39d]" />
                        <span>Mumbai, Maharashtra · India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-slate-500 font-medium">
                Live interactive smartphone preview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE CARD CUSTOMIZER */}
      <section id="customize" className="scroll-mt-20 bg-white py-16 border-y border-slate-200/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Real-Time Studio</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              Make It Yours.
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Preview your card live — try a name, designation and logo below.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Customizer Controls */}
            <div className="rounded-3xl border border-slate-200 bg-[#faf9f6] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5">
                {/* Style Selector */}
                <div>
                  <label className="text-sm font-bold text-slate-800">Card Finish & Style</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CARD_STYLES.map((style, idx) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setCardStyleIdx(idx)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                          cardStyleIdx === idx
                            ? "border-[#00b39d] bg-[#00b39d]/10 text-[#009c88]"
                            : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Designation Inputs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="custom-name" className="text-sm font-bold text-slate-800">
                      Cardholder Name
                    </label>
                    <input
                      id="custom-name"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      maxLength={32}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#00b39d] focus:outline-none focus:ring-1 focus:ring-[#00b39d]"
                      placeholder="e.g. Rajiv Sharma"
                    />
                  </div>

                  <div>
                    <label htmlFor="custom-title" className="text-sm font-bold text-slate-800">
                      Designation
                    </label>
                    <input
                      id="custom-title"
                      type="text"
                      value={customDesignation}
                      onChange={(e) => setCustomDesignation(e.target.value)}
                      maxLength={32}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm focus:border-[#00b39d] focus:outline-none focus:ring-1 focus:ring-[#00b39d]"
                      placeholder="e.g. Managing Director"
                    />
                  </div>
                </div>

                {/* Logo Upload Input */}
                <div>
                  <label className="text-sm font-bold text-slate-800">Company Logo Preview</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-semibold text-slate-600 transition hover:border-[#00b39d] hover:text-[#00b39d]"
                  >
                    {customLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={customLogoUrl}
                        alt="Uploaded logo"
                        className="h-10 w-auto rounded object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        <span>Upload a logo to preview on the card</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Instant visualizer preview — your finalized high-res artwork is confirmed during card checkout.
                </p>
              </div>
            </div>

            {/* Live Interactive Physical Card Display */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div
                className={`relative flex aspect-[1.586/1] w-full max-w-[380px] flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 ${activeCardStyle.cardClass}`}
              >
                {/* Top Row: Logo & Contactless Wave */}
                <div className="flex items-start justify-between">
                  {customLogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={customLogoUrl}
                      alt="Logo"
                      className="h-9 w-9 rounded-md bg-white object-contain p-1 shadow-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${activeCardStyle.accentClass} flex items-center justify-center text-white font-black text-sm`}>
                        T
                      </div>
                      <span className="font-display font-extrabold text-sm tracking-tight">Tapbez</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 opacity-80" aria-label="NFC Contactless">
                    <Wifi className="h-5 w-5 rotate-90" />
                  </div>
                </div>

                {/* Center Chip Graphic */}
                <div className="h-8 w-11 rounded-md bg-amber-400/80 border border-amber-600/40 shadow-inner flex items-center justify-center">
                  <div className="h-4 w-7 rounded-sm border border-amber-700/50" />
                </div>

                {/* Bottom Row: Name, Designation & NFC Tap Badge */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`font-display text-lg font-extrabold tracking-tight ${activeCardStyle.nameClass}`}>
                      {customName || "Your Name"}
                    </p>
                    <p className={`text-xs font-semibold ${activeCardStyle.titleClass}`}>
                      {customDesignation || "Your Designation"}
                    </p>
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${activeCardStyle.badgeClass}`}>
                    SMART NFC
                  </span>
                </div>
              </div>

              {/* Secondary Studio Picture */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md max-w-[380px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/customizer-preview.jpg"
                  alt="Customizer live card rendering sample"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON MATRIX */}
      <section id="compare" className="scroll-mt-20 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Feature Matrix</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              Find Your Perfect NFC Card.
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-48 px-6 py-5 text-sm font-bold text-slate-500">Feature</th>
                  {PRODUCTS.map((prod) => (
                    <th
                      key={prod.id}
                      className={`px-6 py-5 text-center ${
                        prod.recommended ? "bg-[#00b39d]/5" : ""
                      }`}
                    >
                      <span className="block font-display text-base font-bold text-[#0b182d]">
                        {prod.name}
                      </span>
                      <span
                        className={`mt-1 block text-base font-extrabold ${
                          prod.recommended ? "text-[#00b39d]" : "text-slate-600"
                        }`}
                      >
                        {prod.priceLabel}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={row.label} className={idx % 2 === 1 ? "bg-slate-50/70" : ""}>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">{row.label}</th>
                    {PRODUCTS.map((prod) => {
                      const val = (row.values as Record<string, string | boolean>)[prod.id];
                      return (
                        <td
                          key={prod.id}
                          className={`px-6 py-4 text-center ${
                            prod.recommended ? "bg-[#00b39d]/5 font-semibold" : ""
                          }`}
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="mx-auto h-5 w-5 text-[#00b39d]" />
                            ) : (
                              <span className="mx-auto block h-1 w-4 rounded-full bg-slate-300" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-slate-800">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. MAKE EVERY INTRODUCTION COUNT */}
      <section className="bg-white py-16 border-y border-slate-200/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Why Tapbez</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              Make Every Introduction Count.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INTRODUCTION_FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-slate-200 bg-[#faf9f6] p-6 transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00b39d]/10">
                    <IconComp className="h-6 w-6 text-[#00b39d]" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#0b182d]">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. ONE SMART CARD. EVERY PROFESSION. */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Industries & Roles</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
              One Smart Card. Every Profession.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROFESSIONS.map((prof, idx) => (
              <div
                key={prof.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b39d]/10 font-display text-base font-black text-[#00b39d]">
                  {prof.title.slice(0, 1)}
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-[#0b182d]">{prof.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 flex-1">
                  {prof.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FOR TEAMS / CORPORATE BULK ORDERS */}
      <section id="for-teams" className="scroll-mt-20 bg-[#0b182d] text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">
                Enterprise & Organizations
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Smart Networking for Your Entire Team.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Equip your employees with professionally branded NFC business cards and centrally
                managed digital identities.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {TEAM_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#00b39d]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Quantity Selector */}
              <div className="mt-8">
                <p className="text-sm font-bold text-white">How many cards do you need?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BULK_QUANTITIES.map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setSelectedQuantity(qty)}
                      className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                        selectedQuantity === qty
                          ? "border-[#00b39d] bg-[#00b39d] text-white shadow"
                          : "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00b39d] px-8 text-base font-bold text-white shadow-lg shadow-[#00b39d]/25 transition hover:bg-[#009c88]"
                >
                  Request a Corporate Quote
                </button>
              </div>
            </div>

            {/* Corporate Cards Hero Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-700/80 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/corporate-cards.jpg"
                  alt="A set of branded matte black Tapbez NFC cards arranged for a corporate team"
                  width={1024}
                  height={1024}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Quote Dialog Modal */}
        {quoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-[#0b182d] p-6 text-white shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-display text-2xl font-bold">Request a Corporate Quote</h3>
              <p className="mt-1.5 text-sm text-slate-400">
                Tell us about your team and we will prepare a customized quote.
              </p>

              {quoteSubmitted ? (
                <div className="mt-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#00b39d]" />
                  <h4 className="mt-3 text-lg font-bold text-white">Quote Request Received!</h4>
                  <p className="mt-1 text-sm text-slate-300">
                    Connecting you with our enterprise specialist on WhatsApp...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="mt-6 flex flex-col gap-4">
                  {quoteError && (
                    <div className="rounded-xl bg-red-950/60 border border-red-500/50 p-3 text-xs text-red-200">
                      {quoteError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-300">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteCompany}
                      onChange={(e) => setQuoteCompany(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                      placeholder="e.g. Acme Technologies Pvt Ltd"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={quoteContact}
                      onChange={(e) => setQuoteContact(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={quoteMobile}
                        onChange={(e) => setQuoteMobile(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                        placeholder="10-digit mobile"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300">Work Email</label>
                      <input
                        type="email"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Quantity</label>
                      <select
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                      >
                        {BULK_QUANTITIES.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Preferred Card Type</label>
                      <select
                        value={quoteCardType}
                        onChange={(e) => setQuoteCardType(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                      >
                        <option value="Customized PVC">Customized PVC</option>
                        <option value="Customized Metal">Customized Metal</option>
                        <option value="Standard PVC">Standard PVC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Additional Requirements</label>
                    <textarea
                      rows={2}
                      value={quoteRequirements}
                      onChange={(e) => setQuoteRequirements(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white focus:border-[#00b39d] focus:outline-none"
                      placeholder="Special requests, custom engraving, delivery deadline..."
                    />
                  </div>

                  <div className="mt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setQuoteModalOpen(false)}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#00b39d] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-[#009c88]"
                    >
                      Submit & Chat on WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00b39d]">Got Questions?</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0b182d] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Everything you need to know about Tapbez smart cards.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                  isOpen ? "border-[#00b39d]/50 shadow-md ring-1 ring-[#00b39d]/20" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left"
                >
                  <span className="font-display text-base font-bold text-[#0b182d]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#00b39d]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm leading-relaxed text-slate-600 border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-[#0b182d] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-sm">
              {/* Footer Inverted Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landing/tapbez-logo-footer.png"
                alt="Tapbez logo"
                className="h-10 w-auto object-contain"
              />
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                One smart card for your entire professional identity — tap, share and stay connected.
              </p>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Tapbez. All rights reserved.</p>
            <p>NFC business cards with digital business profiles · India</p>
          </div>
        </div>
      </footer>

      {/* 14. STICKY MOBILE BOTTOM BAR */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
          showBottomBar ? "translate-y-0 shadow-2xl" : "translate-y-full"
        }`}
      >
        <a
          href="#cards"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#00b39d] text-base font-bold text-white shadow-lg"
        >
          Design Your NFC Card — Starting ₹999
        </a>
      </div>
    </div>
  );
}

