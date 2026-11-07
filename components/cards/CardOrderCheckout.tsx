"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NfcCardPreview } from "./NfcCardPreview";
import { CARD_PRODUCTS } from "@/lib/billing/service";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CardOrderCheckoutProps {
  initialVariant?: "standard_pvc" | "custom_pvc" | "custom_metal" | "matte_pvc";
  userEmail: string;
  userName: string;
}

const SELECTABLE_CARDS = [
  {
    id: "standard_pvc",
    name: "Standard PVC NFC Card",
    price: 999,
    priceLabel: "₹999",
    tagline: "Simple. Smart. Professional.",
    image: "/landing/card-standard.jpg",
    imageAlt: "Standard white PVC NFC business card",
    badge: null,
    features: [
      "NFC-enabled PVC card",
      "Standard design selection",
      "Linked digital business profile",
      "Tap-to-share functionality",
      "QR sharing option",
    ],
  },
  {
    id: "custom_pvc",
    name: "Customized PVC NFC Card",
    price: 1499,
    priceLabel: "₹1,499",
    tagline: "Your brand. Your identity. Your smart card.",
    image: "/landing/card-custom-pvc.jpg",
    imageAlt: "Customized PVC NFC business card with company branding",
    badge: "Recommended",
    features: [
      "NFC-enabled PVC card",
      "Personalized name & branding",
      "Custom logo and artwork",
      "Digital business profile",
      "Tap and QR sharing",
    ],
  },
  {
    id: "custom_metal",
    name: "Customized Metal NFC Card",
    price: 1999,
    priceLabel: "₹1,999",
    tagline: "Make a premium first impression.",
    image: "/landing/card-metal.jpg",
    imageAlt: "Premium champagne-gold metal NFC business card",
    badge: "Ultra Premium",
    features: [
      "Premium metal card",
      "Custom laser branding",
      "NFC-enabled sharing",
      "Digital business profile",
      "Premium product presentation",
    ],
  },
];

export function CardOrderCheckout({
  initialVariant = "custom_pvc",
  userEmail,
  userName,
}: CardOrderCheckoutProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<"standard_pvc" | "custom_pvc" | "custom_metal" | "matte_pvc">(initialVariant);
  const [quantity, setQuantity] = useState(1);

  // Customization
  const [printedName, setPrintedName] = useState(userName || "Siddharth Mehta");
  const [printedTitle, setPrintedTitle] = useState("Senior Partner");
  const [companyName, setCompanyName] = useState("Vertex Legal Advisory");
  const [colorPalette, setColorPalette] = useState("royal_sapphire");
  const [metalFinish, setMetalFinish] = useState<"champagne_gold" | "obsidian_black" | "rose_gold" | "titanium_silver">("champagne_gold");
  const [qrPosition, setQrPosition] = useState<"back_center" | "back_bottom_right">("back_bottom_right");
  const [proofApproved, setProofApproved] = useState(false);

  // Shipping
  const [fullName, setFullName] = useState(userName || "");
  const [phone, setPhone] = useState("+91 ");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = CARD_PRODUCTS[variant as keyof typeof CARD_PRODUCTS] || CARD_PRODUCTS.custom_pvc;
  const unitPrice = product.priceInr;
  const totalAmount = unitPrice * quantity;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofApproved) {
      setError("Please check the proof approval box to confirm your custom print details.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant,
          quantity,
          printDesignData: {
            printedName,
            printedTitle,
            companyName,
            colorPalette,
            qrPosition,
            proofApproved,
          },
          shippingAddress: {
            fullName,
            phone,
            street,
            city,
            state,
            postalCode,
            country: "India",
          },
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Payment and order creation failed");

      router.push(`/dashboard/orders?success=true&order=${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Failed to process card order");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: 3D CARD CUSTOMIZER PREVIEW */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors sticky top-8">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Interactive Proof Visualizer
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Physical Card Preview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the card to inspect the printed QR code and NFC details on the reverse side.
          </p>
        </div>

        <div className="py-2 flex justify-center">
          <NfcCardPreview
            name={printedName}
            title={printedTitle}
            company={companyName}
            variant={variant}
            colorPalette={colorPalette}
            metalFinish={metalFinish}
            qrPosition={qrPosition}
            isInteractive={true}
          />
        </div>

        {/* Dynamic Card Finish / Palette Selector */}
        {variant === "standard_pvc" ? (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Card Finish & Material
              </label>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Standard Edition</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-300 shadow-xs flex items-center justify-center font-bold text-[9px] text-slate-700">
                  PVC
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Pure Gloss White PVC</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Minimalist aesthetic with high-contrast text</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Included
              </span>
            </div>
          </div>
        ) : variant === "custom_metal" ? (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Aerospace Metal Finish
              </label>
              <span className="text-[10px] font-bold text-amber-500 uppercase">Laser Engraved</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "champagne_gold", label: "Champagne Gold", color: "#d4af37" },
                { id: "obsidian_black", label: "Obsidian Black", color: "#18181b" },
                { id: "rose_gold", label: "Rose Gold Metal", color: "#c27ba0" },
                { id: "titanium_silver", label: "Titanium Silver", color: "#94a3b8" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetalFinish(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    metalFinish === m.id
                      ? "border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white font-bold ring-1 ring-amber-500"
                      : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{m.label}</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: m.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Card Brand Accent Palette
              </label>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Custom Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "royal_sapphire", label: "Royal Sapphire", color: "#2563eb" },
                { id: "emerald_gold", label: "Emerald Luxury", color: "#059669" },
                { id: "noir_gold", label: "Noir & Gold", color: "#f59e0b" },
                { id: "rose_noir", label: "Rose Gold Noir", color: "#e11d48" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setColorPalette(p.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    colorPalette === p.id
                      ? "border-[#00b39d] bg-[#00b39d]/10 text-slate-900 dark:text-white font-bold ring-1 ring-[#00b39d]"
                      : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{p.label}</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: p.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proof Approval Mandatory Check */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-700 dark:text-slate-300 leading-snug">
            <input
              type="checkbox"
              required
              checked={proofApproved}
              onChange={(e) => setProofApproved(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-white/20 text-blue-600 focus:ring-0"
            />
            <span>
              <strong>I approve this custom design proof.</strong> I understand spelling, capitalization, and formatting will be manufactured exactly as displayed in the live 3D preview.
            </span>
          </label>
        </div>
      </div>

      {/* RIGHT: CUSTOMIZATION FORM & CHECKOUT */}
      <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-6 transition-colors">
        <form onSubmit={handleCheckout} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Hardware Variant Selection - 3 Options with Images */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>1. Select Card Hardware Option</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  3 Options Available
                </span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Click a card to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {SELECTABLE_CARDS.map((card) => {
                const isSelected =
                  variant === card.id ||
                  (card.id === "custom_pvc" && variant === "matte_pvc");

                return (
                  <div
                    key={card.id}
                    onClick={() => setVariant(card.id as any)}
                    className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "border-[#00b39d] ring-2 ring-[#00b39d] bg-[#00b39d]/5 dark:bg-[#00b39d]/10 shadow-lg shadow-[#00b39d]/15"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100/70 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {/* Badge */}
                    {card.badge && (
                      <span className="absolute top-2.5 right-2.5 z-10 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00b39d] text-white shadow-md">
                        {card.badge}
                      </span>
                    )}

                    {/* Card Product Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-baseline justify-between">
                        <span className="text-base font-black text-white drop-shadow-md">
                          {card.priceLabel}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-[#00b39d] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#00b39d]" />
                            Selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content & Features */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {card.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {card.tagline}
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/5">
                        {card.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#00b39d] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Selection Button */}
                      <div className="pt-1">
                        <div
                          className={`w-full py-1.5 rounded-lg text-xs font-bold text-center transition-colors ${
                            isSelected
                              ? "bg-[#00b39d] text-white shadow-sm"
                              : "bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 group-hover:bg-[#00b39d] group-hover:text-white"
                          }`}
                        >
                          {isSelected ? "✓ Option Selected" : "Select Option"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helper Notice based on selection */}
            {variant === "standard_pvc" ? (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Standard PVC Tier (₹999):</strong> High-gloss durable PVC with standard typographic layout. For custom company logos, artwork & foil accents, select <strong>Customized PVC</strong> or <strong>Customized Metal</strong> above.
                </span>
              </div>
            ) : variant === "custom_metal" ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Customized Metal Tier (₹1,999):</strong> Aerospace-grade metal card with precision laser engraving, luxury weight, and presentation sleeve included.
                </span>
              </div>
            ) : null}
          </div>

          {/* 2. Personalized Print Typography */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Cardholder Details to Print</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Printed Name
                </label>
                <input
                  type="text"
                  required
                  value={printedName}
                  onChange={(e) => setPrintedName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={printedTitle}
                  onChange={(e) => setPrintedTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Shipping Delivery Address */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>3. Shipping Delivery Address (India Express Dispatch)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Street Address / Flat / Floor
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 402, Signature Towers, MG Road"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  PIN / Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560001"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>1 Card (₹{unitPrice})</option>
                  <option value={2}>2 Cards (₹{unitPrice * 2})</option>
                  <option value={5}>5 Cards (₹{unitPrice * 5})</option>
                  <option value={10}>10 Cards (₹{unitPrice * 10})</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Order Summary & Verified Checkout */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>{product.name} (x{quantity})</span>
              <span className="font-mono text-white font-bold">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Express Insured Shipping</span>
              <span className="text-emerald-400 font-semibold">Free</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex justify-between text-sm font-extrabold text-white">
              <span>Total Payable</span>
              <span className="font-mono text-lg text-emerald-400">₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !proofApproved}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{loading ? "Processing Order & Verifying Payment..." : `Complete Order & Pay ₹${totalAmount}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            Encrypted payment via Razorpay. NDEF encoding and laser QA check performed prior to dispatch.
          </p>
        </form>
      </div>
    </div>
  );
}
