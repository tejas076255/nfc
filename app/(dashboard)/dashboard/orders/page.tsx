import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceOrders, CARD_PRODUCTS } from "@/lib/billing/service";
import {
  ShoppingBag,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Physical NFC Card Orders | Tapbez",
  description: "Track your customized NFC business card production, QA verification, and courier dispatch.",
};

export default async function DashboardOrdersPage() {
  const session = await getCurrentSession();
  if (!session || !session.workspace) {
    redirect("/login");
  }

  const orders = await getWorkspaceOrders(session.workspace.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "shipped":
        return {
          label: "In Transit / Shipped",
          color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
          icon: Truck,
        };
      case "ready_to_ship":
        return {
          label: "Packed & Ready to Dispatch",
          color: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30",
          icon: Package,
        };
      case "qa":
        return {
          label: "NDEF Encoding & QA Testing",
          color: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
          icon: ShieldCheck,
        };
      case "production":
        return {
          label: "UV Print & Surface Finishing",
          color: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
          icon: Layers,
        };
      case "paid":
      default:
        return {
          label: "Order Confirmed & Queued",
          color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10",
          icon: Clock,
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 transition-colors">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Hardware Fulfillment</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            NFC Card Orders
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your custom-printed NFC cards through automated production, cryptographic NDEF encoding, and express delivery.
          </p>
        </div>

        <Link
          href="/orders/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Order New NFC Card</span>
        </Link>
      </div>

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-center space-y-5 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Physical NFC Cards Ordered Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Order your custom-branded, contactless NFC smart card. Embedded with an NTAG213 cryptographic chip and high-contrast QR backup for instant profile sharing on any smartphone.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Design Your Card Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const StatusIcon = badge.icon;
            const product =
              CARD_PRODUCTS[order.cardVariant as keyof typeof CARD_PRODUCTS] || CARD_PRODUCTS.standard_pvc;

            let shipping: any = {};
            try {
              shipping = JSON.parse(order.shippingAddress);
            } catch (e) {
              shipping = {};
            }

            return (
              <div
                key={order.id}
                className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs space-y-6"
              >
                {/* Top Row: Order ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ordered on {new Date(order.createdAt * 1000).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{order.totalAmountInr.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Payment Verified (Razorpay)</div>
                  </div>
                </div>

                {/* Middle Row: Product & Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Specification */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Hardware Item
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{product.description}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-white/10 shrink-0 ml-3">
                        Qty: {order.quantity}
                      </span>
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                          <Truck className="w-4 h-4 shrink-0" />
                          <span>
                            {order.trackingCarrier}:{" "}
                            <span className="font-mono text-slate-900 dark:text-white">{order.trackingNumber}</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Express Courier</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Delivery Destination</span>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      <div className="font-bold text-slate-900 dark:text-white">{shipping.fullName || "Valued Customer"}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {shipping.street ? `${shipping.street}, ` : ""}
                        {shipping.city ? `${shipping.city}, ` : ""}
                        {shipping.state ? `${shipping.state} ` : ""}
                        {shipping.postalCode || ""}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Phone: <span className="text-slate-800 dark:text-slate-300 font-mono font-semibold">{shipping.phone || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* State Progress Bar */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">Fulfillment Journey</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div
                      className={`p-2 rounded-lg border font-bold ${
                        ["paid", "production", "qa", "ready_to_ship", "shipped", "delivered"].includes(order.status)
                          ? "bg-blue-50 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
                      }`}
                    >
                      1. Paid & Queued
                    </div>
                    <div
                      className={`p-2 rounded-lg border font-bold ${
                        ["production", "qa", "ready_to_ship", "shipped", "delivered"].includes(order.status)
                          ? "bg-blue-50 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
                      }`}
                    >
                      2. UV Printing & NDEF
                    </div>
                    <div
                      className={`p-2 rounded-lg border font-bold ${
                        ["qa", "ready_to_ship", "shipped", "delivered"].includes(order.status)
                          ? "bg-blue-50 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
                      }`}
                    >
                      3. Hardware QA Pass
                    </div>
                    <div
                      className={`p-2 rounded-lg border font-bold ${
                        ["shipped", "delivered"].includes(order.status)
                          ? "bg-emerald-50 dark:bg-emerald-600/20 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-400"
                      }`}
                    >
                      4. Dispatched
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
