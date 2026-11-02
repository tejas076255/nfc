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
  initialVariant?: "standard_pvc" | "matte_pvc";
  userEmail: string;
  userName: string;
}

export function CardOrderCheckout({
  initialVariant = "matte_pvc",
  userEmail,
  userName,
}: CardOrderCheckoutProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<"standard_pvc" | "matte_pvc">(initialVariant);
  const [quantity, setQuantity] = useState(1);

  // Customization
  const [printedName, setPrintedName] = useState(userName || "Siddharth Mehta");
  const [printedTitle, setPrintedTitle] = useState("Senior Partner");
  const [companyName, setCompanyName] = useState("Vertex Legal Advisory");
  const [colorPalette, setColorPalette] = useState("noir_gold");
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

  const product = CARD_PRODUCTS[variant];
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Interactive Proof Visualizer
          </span>
          <h2 className="text-lg font-bold text-white">Live Physical Card Preview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400">
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
            qrPosition={qrPosition}
            isInteractive={true}
          />
        </div>

        {/* Palette Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Card Theme & Foil Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "noir_gold", label: "Noir & Gold", color: "#f59e0b" },
              { id: "emerald_gold", label: "Emerald Luxury", color: "#10b981" },
              { id: "royal_sapphire", label: "Royal Sapphire", color: "#3b82f6" },
              { id: "rose_noir", label: "Rose Gold Noir", color: "#f43f5e" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setColorPalette(p.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                  colorPalette === p.id
                    ? "border-blue-500 bg-blue-600/10 text-white"
                    : "border-white/10 bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-white"
                }`}
              >
                <span>{p.label}</span>
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: p.color }}
                />
              </button>
            ))}
          </div>
        </div>

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

          {/* 1. Hardware Variant Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Select Card Hardware Variant</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setVariant("standard_pvc")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  variant === "standard_pvc"
                    ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-600/10 shadow-sm"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Standard PVC</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">₹499</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 dark:text-slate-400">High-gloss durable PVC</p>
                </div>
              </div>

              <div
                onClick={() => setVariant("matte_pvc")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  variant === "matte_pvc"
                    ? "border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-sm"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Premium Matte PVC</span>
                    <span className="text-sm font-bold text-amber-400">₹999</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 dark:text-slate-400">Velvet soft-touch luxury finish</p>
                </div>
              </div>
            </div>
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
