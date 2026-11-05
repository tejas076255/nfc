"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  Layers,
  Truck,
  Cpu,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Check,
  X,
  FileSpreadsheet,
  History,
  QrCode,
  MapPin,
  ExternalLink,
  Smartphone,
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  Building2,
  Plus,
  RefreshCw,
  Copy,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Eye,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  cardVariant: string;
  quantity: number;
  totalAmountInr: number;
  shippingAddress: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: number;
}

interface AdminCard {
  id: string;
  publicToken: string;
  productVariant: string;
  inventoryStatus: string;
  activationStatus: string;
  isActive: number;
  createdAt: number;
}

interface AuditLogItem {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: string | null;
  createdAt: number;
}

interface AdminProfile {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  status: string;
  workspaceId: string;
  createdAt: number;
  updatedAt: number;
}

export function AdminStationView({
  orders: initialOrders,
  cards: initialCards,
  auditLogs: initialAuditLogs,
  profiles: initialProfiles = [],
  stats: initialStats,
}: {
  orders: AdminOrder[];
  cards: AdminCard[];
  auditLogs: AuditLogItem[];
  profiles?: AdminProfile[];
  stats?: {
    totalProfiles: number;
    totalUsers: number;
    totalWorkspaces: number;
    totalCards: number;
    totalOrders: number;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as any;

  const validTabs = ["overview", "profiles", "orders", "qa", "inventory", "logs"];
  const [activeTab, setActiveTab] = useState<"overview" | "profiles" | "orders" | "inventory" | "qa" | "logs">(
    validTabs.includes(urlTab) ? urlTab : "overview"
  );

  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tab: "overview" | "profiles" | "orders" | "inventory" | "qa" | "logs") => {
    setActiveTab(tab);
    router.replace(`/admin?tab=${tab}`, { scroll: false });
  };

  // State
  const [stats, setStats] = useState(
    initialStats || {
      totalProfiles: initialProfiles.length,
      totalUsers: 0,
      totalWorkspaces: 0,
      totalCards: initialCards.length,
      totalOrders: initialOrders.length,
    }
  );

  const [profiles, setProfiles] = useState<AdminProfile[]>(initialProfiles);
  const [profileSearch, setProfileSearch] = useState("");
  const [profileStatusFilter, setProfileStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [togglingProfileId, setTogglingProfileId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [creatingSampleOrder, setCreatingSampleOrder] = useState(false);

  // Cards & Inventory State
  const [cards, setCards] = useState<AdminCard[]>(initialCards);
  const [batchQty, setBatchQty] = useState(10);
  const [batchVariant, setBatchVariant] = useState<"standard_pvc" | "matte_pvc">("standard_pvc");
  const [generatingBatch, setGeneratingBatch] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<any[] | null>(null);

  // QA Station State
  const [qaCardToken, setQaCardToken] = useState("");
  const [qaStep, setQaStep] = useState<"ndef_readback" | "qr_mapping" | "visual_print" | "final_pass">("final_pass");
  const [qaResult, setQaResult] = useState<"pass" | "fail">("pass");
  const [qaNotes, setQaNotes] = useState("");
  const [qaLoading, setQaLoading] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [logSearch, setLogSearch] = useState("");

  // Feedback Notification
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // --- ACTIONS ---

  // 1. Create Sample Test Order
  const handleCreateSampleOrder = async () => {
    setCreatingSampleOrder(true);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: "matte_pvc", quantity: 1 }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to create test order");

      setOrders((prev) => [data.order, ...prev]);
      setStats((prev) => ({ ...prev, totalOrders: prev.totalOrders + 1 }));
      setAlert({
        type: "success",
        text: `Live test order ${data.order.orderNumber} created! You can now test state transitions in the queue below.`,
      });
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Error creating sample order" });
    } finally {
      setCreatingSampleOrder(false);
    }
  };

  // 2. Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    carrier?: string,
    tracking?: string
  ) => {
    setUpdatingOrderId(orderId);
    setAlert(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingCarrier: carrier,
          trackingNumber: tracking,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to update order status");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              status: newStatus,
              trackingCarrier: carrier !== undefined ? carrier : o.trackingCarrier,
              trackingNumber: tracking !== undefined ? tracking : o.trackingNumber,
            }
            : o
        )
      );

      setAlert({ type: "success", text: `Order status successfully updated to '${newStatus}'.` });
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Error updating order" });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 3. Toggle Profile Status (Publish / Draft)
  const handleToggleProfileStatus = async (profileId: string) => {
    setTogglingProfileId(profileId);
    setAlert(null);
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/toggle-status`, {
        method: "POST",
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to toggle profile status");

      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, status: data.profile.status } : p))
      );
      setAlert({
        type: "success",
        text: `Profile '${data.profile.slug}' status changed to '${data.profile.status.toUpperCase()}'.`,
      });
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to update profile status" });
    } finally {
      setTogglingProfileId(null);
    }
  };

  // 4. Copy URL helper
  const handleCopyProfileUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // 5. Generate Hardware Batch
  const handleGenerateBatch = async () => {
    setGeneratingBatch(true);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: batchQty, variant: batchVariant }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to generate batch");

      setGeneratedBatch(data.cards);
      setCards((prev) => [...data.cards, ...prev]);
      setStats((prev) => ({ ...prev, totalCards: prev.totalCards + data.count }));
      setAlert({
        type: "success",
        text: `Successfully provisioned ${data.count} factory card records in Cloudflare D1 with claim secrets!`,
      });
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to generate batch" });
    } finally {
      setGeneratingBatch(false);
    }
  };

  // 6. Download Factory CSV
  const downloadBatchCsv = () => {
    if (!generatedBatch || generatedBatch.length === 0) return;
    const headers = ["Card ID", "Public Token", "NDEF Redirect URL", "Claim Secret", "Product Variant"];
    const rows = generatedBatch.map((c) => [c.id, c.publicToken, c.ndefUrl, c.claimSecret, c.variant]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tapsync_factory_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 7. Record QA Record
  const handleRecordQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaCardToken) return;

    setQaLoading(true);
    setAlert(null);

    const tokenClean = qaCardToken.trim().toLowerCase();
    const targetCard = cards.find((c) => c.publicToken.toLowerCase() === tokenClean);

    if (!targetCard) {
      setAlert({
        type: "error",
        text: `No card found with token '${qaCardToken}'. Please select an available card or mint a batch first.`,
      });
      setQaLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: targetCard.id,
          step: qaStep,
          result: qaResult,
          readbackUrl: `https://tapbez.in/t/${targetCard.publicToken}`,
          verifiedQrToken: targetCard.publicToken,
          notes: qaNotes,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to submit QA record");

      const newInvStatus = qaResult === "pass" ? "qa_pass" : "qa_fail";
      setCards((prev) =>
        prev.map((c) => (c.id === targetCard.id ? { ...c, inventoryStatus: newInvStatus } : c))
      );

      setAlert({
        type: "success",
        text: `QA Inspection logged successfully! Card ${targetCard.publicToken} status updated to ${newInvStatus.toUpperCase()}.`,
      });
      setQaCardToken("");
      setQaNotes("");
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to record QA" });
    } finally {
      setQaLoading(false);
    }
  };

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    if (profileStatusFilter !== "all" && p.status !== profileStatusFilter) return false;
    if (profileSearch) {
      const q = profileSearch.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alert && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 border shadow-xs transition-all ${alert.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30"
            }`}
        >
          <div className="flex items-center gap-3">
            {alert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{alert.text}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="p-1 hover:opacity-70 text-slate-500"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP TABS NAVIGATION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "overview"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => handleTabChange("profiles")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "profiles"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Profiles Directory ({profiles.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("orders")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "orders"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fulfillment & Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("qa")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "qa"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hardware QA Terminal</span>
        </button>

        <button
          onClick={() => handleTabChange("inventory")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "inventory"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <Layers className="w-4 h-4" />
          <span>Factory Batch Mint</span>
        </button>

        <button
          onClick={() => handleTabChange("logs")}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "logs"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
            }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SYSTEM OVERVIEW                                   */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 inline-block mb-1">
                  Master Operations Hub
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Platform Operations & Hardware Control
                </h2>
                <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
                  Real-time Cloudflare D1 telemetry for user profiles, physical NFC provisioning, BlueDart dispatch pipelines, and cryptographic QA records.
                </p>
              </div>
              <button
                onClick={handleCreateSampleOrder}
                disabled={creatingSampleOrder}
                className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
              >
                {creatingSampleOrder ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>+ Create Test Order</span>
              </button>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Profiles Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalProfiles}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Digital Profiles
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalUsers}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Registered Users
                </div>
              </div>
            </div>

            {/* Workspaces Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalWorkspaces}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Active Workspaces
                </div>
              </div>
            </div>

            {/* Hardware Cards */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalCards}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  NFC Physical Cards
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalOrders}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Card Orders
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Operations Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleTabChange("profiles")}
                className="p-5 rounded-2xl bg-white hover:bg-purple-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Profiles Directory
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Inspect & toggle live status for all {profiles.length} member profiles.
                </div>
              </button>

              <button
                onClick={() => handleTabChange("orders")}
                className="p-5 rounded-2xl bg-white hover:bg-blue-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Fulfillment Pipeline
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Progress physical card orders from UV Print to Courier Dispatch.
                </div>
              </button>

              <button
                onClick={() => handleTabChange("qa")}
                className="p-5 rounded-2xl bg-white hover:bg-emerald-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Hardware QA Terminal
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Verify NTAG213 cryptographic readback before customer delivery.
                </div>
              </button>

              <button
                onClick={() => handleTabChange("inventory")}
                className="p-5 rounded-2xl bg-white hover:bg-amber-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Factory Batch Mint
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Generate unassigned batch tokens and download factory printing CSV.
                </div>
              </button>
            </div>
          </div>

          {/* Recent Audit Events preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recent Security & Operations Activity
              </h3>
              <button
                onClick={() => handleTabChange("logs")}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                View Full Audit Trail ({auditLogs.length}) →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {auditLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(log.createdAt * 1000).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <span className="capitalize">{log.actorRole}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        {log.resourceType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PROFILES DIRECTORY                                */}
      {/* ======================================================== */}
      {activeTab === "profiles" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Member Digital Profiles Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage, inspect live links, and toggle published status across all workspaces in remote D1.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, slug, title..."
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
                />
              </div>

              <select
                value={profileStatusFilter}
                onChange={(e) => setProfileStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="all">All Statuses ({profiles.length})</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((p) => {
              const isPublished = p.status === "published";
              const isToggling = togglingProfileId === p.id;
              const isCopied = copiedSlug === p.slug;

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {p.title || "Digital Identity"}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${isPublished
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40"
                            : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                          }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-white/5 text-[11px] font-mono text-purple-700 dark:text-purple-300 flex items-center justify-between gap-2">
                      <span className="truncate">/p/{p.slug}</span>
                      <button
                        onClick={() => handleCopyProfileUrl(p.slug)}
                        title="Copy Public Profile URL"
                        className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 p-1 rounded-md transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Created: {new Date(p.createdAt * 1000).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/p/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Open Live Public View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>

                      <a
                        href={`/api/profiles/${p.id}/vcard`}
                        download={`${p.slug}.vcf`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Download Contact Card (.vcf)"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>vCard</span>
                      </a>
                    </div>

                    <button
                      onClick={() => handleToggleProfileStatus(p.id)}
                      disabled={isToggling}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${isPublished
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                        }`}
                    >
                      {isToggling ? (
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                      ) : isPublished ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ORDER FULFILLMENT                                 */}
      {/* ======================================================== */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Physical Card Production & Dispatch Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Move custom physical cards from verified payment through UV printing, NDEF encoding, and BlueDart courier dispatch.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                onClick={handleCreateSampleOrder}
                disabled={creatingSampleOrder}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {creatingSampleOrder ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>+ Test Order</span>
              </button>
            </div>
          </div>

          {/* If 0 Orders */}
          {orders.length === 0 ? (
            <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center space-y-4 bg-white dark:bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Physical Card Orders Yet
                </h3>
                <p className="text-xs text-slate-500">
                  Customer NFC card orders will show up here. You can click below to generate a live test order in the database to test the factory pipeline.
                </p>
              </div>
              <button
                onClick={handleCreateSampleOrder}
                disabled={creatingSampleOrder}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Live Test Order</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((o) => o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()))
                .map((order) => {
                  let address: any = {};
                  try {
                    address = JSON.parse(order.shippingAddress);
                  } catch { }

                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Ordered on {new Date(order.createdAt * 1000).toLocaleString("en-IN")} • Amount: ₹
                            {order.totalAmountInr}
                          </p>
                        </div>

                        {/* State Transition Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {order.status === "paid" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "production")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Send to UV Print & Encode →
                            </button>
                          )}

                          {order.status === "production" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "qa")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Send to QA Inspection →
                            </button>
                          )}

                          {order.status === "qa" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "ready_to_ship")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Pack & Ready to Ship →
                            </button>
                          )}

                          {order.status === "ready_to_ship" && (
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  "shipped",
                                  "BlueDart Express",
                                  `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`
                                )
                              }
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Dispatch with BlueDart →
                            </button>
                          )}

                          {order.status === "shipped" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              ✓ Mark Delivered
                            </button>
                          )}

                          {order.status === "delivered" && (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Delivered to Customer
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Order Details & Shipping */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-white/5 space-y-1">
                          <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                            Hardware Item Details
                          </div>
                          <div className="text-slate-900 dark:text-white font-semibold">
                            Variant: <strong className="capitalize">{order.cardVariant.replace("_", " ")}</strong>
                          </div>
                          <div className="text-slate-500">Quantity: {order.quantity} physical card(s)</div>
                          {order.trackingNumber && (
                            <div className="text-blue-600 dark:text-blue-400 font-semibold pt-1">
                              Courier: {order.trackingCarrier} (<strong>{order.trackingNumber}</strong>)
                            </div>
                          )}
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-white/5 space-y-1">
                          <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                            Shipping Destination
                          </div>
                          <div className="text-slate-900 dark:text-white font-bold">{address.fullName || "Customer"}</div>
                          <div className="text-slate-500">
                            {address.street}, {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div className="text-slate-500">Phone: {address.phone}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: HARDWARE QA STATION                               */}
      {/* ======================================================== */}
      {activeTab === "qa" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="max-w-xl space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Hardware Encoding & Inspection Station
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perform simulated cryptographic read-back verification on NTAG213 chips. Confirm the public redirect URL matches the printed QR token before customer dispatch.
            </p>
          </div>

          <form
            onSubmit={handleRecordQa}
            className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-xs max-w-xl space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Scan or Enter Card Token
                </label>
                {cards.length > 0 && (
                  <span className="text-[11px] text-slate-400">
                    {cards.length} cards available in warehouse
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. t_7d8a9f... or select below"
                value={qaCardToken}
                onChange={(e) => setQaCardToken(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 font-mono"
              />

              {/* Quick Select Cards */}
              {cards.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Quick pick:</span>
                  {cards.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setQaCardToken(c.publicToken)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {c.publicToken}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Inspection Stage
                </label>
                <select
                  value={qaStep}
                  onChange={(e) => setQaStep(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 cursor-pointer font-semibold"
                >
                  <option value="ndef_readback">NDEF Readback Test</option>
                  <option value="qr_mapping">QR Mapping Match</option>
                  <option value="visual_print">Visual Print Quality</option>
                  <option value="final_pass">Final QA Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Inspection Verdict
                </label>
                <select
                  value={qaResult}
                  onChange={(e) => setQaResult(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 cursor-pointer font-semibold"
                >
                  <option value="pass">PASS (Certified)</option>
                  <option value="fail">FAIL (Quarantine)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Station Notes
              </label>
              <input
                type="text"
                placeholder="e.g. NFC chip antenna capacitance verified. Edge alignment clean."
                value={qaNotes}
                onChange={(e) => setQaNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={qaLoading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {qaLoading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log QA Certification Record</span>
                </>
              )}
            </button>
          </form>

          {/* Warehouse Card Inventory Table */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Warehouse Card QA Status ({cards.length})
            </h3>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Card Token</th>
                    <th className="py-3 px-4">Variant</th>
                    <th className="py-3 px-4">Inventory Status</th>
                    <th className="py-3 px-4">Activation</th>
                    <th className="py-3 px-4 text-right">Redirect Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {cards.slice(0, 10).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-purple-700 dark:text-purple-300">
                        {c.publicToken}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-700 dark:text-slate-300">
                        {c.productVariant.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${c.inventoryStatus === "qa_pass"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                              : c.inventoryStatus === "qa_fail"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                        >
                          {c.inventoryStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 capitalize">
                        {c.activationStatus}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/t/${c.publicToken}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>/t/{c.publicToken}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: FACTORY BATCH GENERATOR                           */}
      {/* ======================================================== */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Factory Card Batch Provisioning
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Generate batches of unassigned physical NFC cards in Cloudflare D1. Each card receives an unguessable HTTPS redirect token and a single-use claim secret. Download the CSV file for factory laser encoding and packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-xs max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Batch Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batchQty}
                  onChange={(e) => setBatchQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Card Hardware Finish
                </label>
                <select
                  value={batchVariant}
                  onChange={(e) => setBatchVariant(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 cursor-pointer font-semibold"
                >
                  <option value="standard_pvc">Standard Gloss PVC</option>
                  <option value="matte_pvc">Premium Matte PVC</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateBatch}
              disabled={generatingBatch}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {generatingBatch ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Generate Cryptographic Batch in D1</span>
                </>
              )}
            </button>
          </div>

          {generatedBatch && generatedBatch.length > 0 && (
            <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    Batch Ready: {generatedBatch.length} Cards Provisioned
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-slate-400">
                    Download factory printing manifest containing NDEF redirect URLs and scratch-off claim secrets.
                  </p>
                </div>

                <button
                  onClick={downloadBatchCsv}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download Factory CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SECURITY & AUDIT TRAIL                            */}
      {/* ======================================================== */}
      {activeTab === "logs" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                System Audit & Compliance Trail
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable records for administrator actions, order status mutations, card batch claims, and hardware certifications.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter audit logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {auditLogs
                  .filter(
                    (l) =>
                      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
                      l.actorRole.toLowerCase().includes(logSearch.toLowerCase()) ||
                      (l.resourceType && l.resourceType.toLowerCase().includes(logSearch.toLowerCase()))
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(log.createdAt * 1000).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white capitalize">
                          {log.actorRole}
                        </span>{" "}
                        <span className="text-[11px] text-slate-400">({log.actorId.slice(0, 8)}...)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                        {log.resourceType}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] truncate max-w-xs">
                        {log.metadata || "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
