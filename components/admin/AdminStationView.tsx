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
  MessageSquare,
  Mail,
  Sparkles,
  Filter,
  Edit3,
} from "lucide-react";

interface AdminSupportTicket {
  id: string;
  workspaceId: string | null;
  userId: string | null;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: number;
  updatedAt: number;
}

interface AdminWorkspaceSlotInfo {
  id: string;
  name: string;
  slug: string;
  extraSlots: number;
  status: string;
  ownerEmail: string;
  ownerName: string;
  planCode: string;
  planName: string;
  baseLimit: number;
  totalAllottedSlots: number;
  createdAt: number;
}

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
  initialSupportTickets = [],
  initialWorkspaces = [],
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
  initialSupportTickets?: AdminSupportTicket[];
  initialWorkspaces?: AdminWorkspaceSlotInfo[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as any;

  const validTabs = ["overview", "orders", "slots", "support", "profiles", "qa", "inventory", "logs"];
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "slots" | "support" | "profiles" | "qa" | "inventory" | "logs"
  >(validTabs.includes(urlTab) ? urlTab : "overview");

  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (
    tab: "overview" | "orders" | "slots" | "support" | "profiles" | "qa" | "inventory" | "logs"
  ) => {
    setActiveTab(tab);
    router.replace(`/admin?tab=${tab}`, { scroll: false });
  };

  // State
  const [stats, setStats] = useState(
    initialStats || {
      totalProfiles: initialProfiles.length,
      totalUsers: initialWorkspaces.length,
      totalWorkspaces: initialWorkspaces.length,
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
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Workspaces & Slots Quota State
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceSlotInfo[]>(initialWorkspaces);
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [allocatingWorkspace, setAllocatingWorkspace] = useState<AdminWorkspaceSlotInfo | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [selectedExtraSlots, setSelectedExtraSlots] = useState<number>(0);
  const [isAllocating, setIsAllocating] = useState(false);

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<AdminSupportTicket[]>(initialSupportTickets);
  const [supportSearch, setSupportSearch] = useState("");
  const [supportStatusFilter, setSupportStatusFilter] = useState<string>("all");
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);

  // Cards & Inventory State
  const [cards, setCards] = useState<AdminCard[]>(initialCards);
  const [batchQty, setBatchQty] = useState(10);
  const [batchVariant, setBatchVariant] = useState<"standard_pvc" | "matte_pvc" | "custom_pvc" | "custom_metal">("standard_pvc");
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

  // 1. Update Order Status
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

  // 4. Update Support Ticket Status
  const handleUpdateTicketStatus = async (
    ticketId: string,
    newStatus: "open" | "in_progress" | "resolved" | "closed"
  ) => {
    setUpdatingTicketId(ticketId);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to update ticket status");

      setSupportTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      setAlert({ type: "success", text: `Support Ticket #${ticketId} status changed to '${newStatus}'.` });
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to update ticket status" });
    } finally {
      setUpdatingTicketId(null);
    }
  };

  // 5. Open Allocation Modal
  const openAllocationModal = (ws: AdminWorkspaceSlotInfo) => {
    setAllocatingWorkspace(ws);
    setSelectedPlan(ws.planCode || "free");
    setSelectedExtraSlots(ws.extraSlots || 0);
  };

  // Auto-Save Slot Allocation State
  const [savingSlotWsId, setSavingSlotWsId] = useState<string | null>(null);
  const [savedSlotWsId, setSavedSlotWsId] = useState<string | null>(null);

  // 6. Inline / Direct Auto-Save Slot Allocation
  const handleAutoSaveSlot = async (
    workspaceId: string,
    planCode: string,
    extraSlots: number
  ) => {
    setSavingSlotWsId(workspaceId);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          extraSlots: Math.max(0, extraSlots),
          planCode,
        }),
      });
      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to auto-save slot allocation");

      const planLimitMap: Record<string, { name: string; limit: number }> = {
        free: { name: "Free Digital Identity", limit: 1 },
        starter: { name: "Starter Plan", limit: 3 },
        professional: { name: "Professional Plan", limit: 10 },
        business_pro: { name: "Business Pro", limit: 25 },
      };
      const pInfo = planLimitMap[planCode] || { name: planCode, limit: 1 };

      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                planCode,
                planName: pInfo.name,
                baseLimit: pInfo.limit,
                extraSlots: Math.max(0, extraSlots),
                totalAllottedSlots: pInfo.limit + Math.max(0, extraSlots),
              }
            : w
        )
      );

      setSavedSlotWsId(workspaceId);
      setTimeout(() => setSavedSlotWsId(null), 3000);
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to auto-save slots" });
    } finally {
      setSavingSlotWsId(null);
    }
  };

  // 7. Save Slot Allocation from Modal
  const handleSaveSlotAllocation = async () => {
    if (!allocatingWorkspace) return;
    setIsAllocating(true);
    try {
      await handleAutoSaveSlot(allocatingWorkspace.id, selectedPlan, selectedExtraSlots);
      setAllocatingWorkspace(null);
    } finally {
      setIsAllocating(false);
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2 border-b border-slate-200 dark:border-amber-500/20 pb-4">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => handleTabChange("orders")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Card Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("slots")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "slots"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>User Slots & Quotas ({workspaces.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("support")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "support"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support Inquiries ({supportTickets.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("profiles")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "profiles"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Profiles Directory ({profiles.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("qa")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "qa"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Hardware QA</span>
        </button>

        <button
          onClick={() => handleTabChange("inventory")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "inventory"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Factory Mint</span>
        </button>

        <button
          onClick={() => handleTabChange("logs")}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20"
              : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SYSTEM OVERVIEW                                   */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 shadow-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/20 border border-slate-950/30 inline-block mb-1 text-slate-950">
                  Tapbez Sovereign Operations Hub
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                  Platform Operations & Hardware Control
                </h2>
                <p className="text-xs text-slate-900/90 font-medium max-w-2xl leading-relaxed">
                  Real-time Cloudflare D1 telemetry for user profiles, subscription slot allocation, physical NFC fulfillment, customer support tickets, and cryptographic QA records.
                </p>
              </div>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Profiles Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-amber-500/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
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
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-amber-500/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalUsers}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Users / Workspaces
                </div>
              </div>
            </div>

            {/* Total Active Slots Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-amber-500/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-500">
                  {workspaces.reduce((acc, w) => acc + (w.totalAllottedSlots || 1), 0)}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Active Slots
                </div>
              </div>
            </div>

            {/* Support Inquiries Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-amber-500/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {supportTickets.length}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Support Inquiries
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200/80 dark:border-amber-500/15 shadow-xs space-y-3 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {orders.length}
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
              Quick Executive Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleTabChange("orders")}
                className="p-5 rounded-2xl bg-white hover:bg-amber-50/40 dark:bg-[#0c101d] dark:hover:bg-[#12182b] border border-slate-200 dark:border-amber-500/20 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Fulfillment Pipeline
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Progress physical card orders from UV Print to Courier Dispatch. ({orders.length} orders)
                </div>
              </button>

              <button
                onClick={() => handleTabChange("slots")}
                className="p-5 rounded-2xl bg-white hover:bg-amber-50/40 dark:bg-[#0c101d] dark:hover:bg-[#12182b] border border-slate-200 dark:border-amber-500/20 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  User Slots & Quotas
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Allot card slots per user subscription or assign add-on slots.
                </div>
              </button>

              <button
                onClick={() => handleTabChange("support")}
                className="p-5 rounded-2xl bg-white hover:bg-emerald-50/40 dark:bg-[#0c101d] dark:hover:bg-[#12182b] border border-slate-200 dark:border-amber-500/20 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Support Inquiries
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Review customer helpdesk tickets and problem messages. ({supportTickets.length} tickets)
                </div>
              </button>

              <button
                onClick={() => handleTabChange("profiles")}
                className="p-5 rounded-2xl bg-white hover:bg-amber-50/40 dark:bg-[#0c101d] dark:hover:bg-[#12182b] border border-slate-200 dark:border-amber-500/20 text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-amber-500" />
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Profiles Directory
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Inspect & toggle live status for all {profiles.length} member profiles.
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
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
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
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                <span>Physical Card Fulfillment & Production Queue</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Move custom physical cards from verified payment through UV printing, NDEF encoding, and BlueDart courier dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filters */}
              <div className="flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-0.5 shrink-0 overflow-x-auto">
                {(["all", "paid", "production", "qa", "shipped", "delivered"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderStatusFilter(filter)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      orderStatusFilter === filter
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* If 0 Orders */}
          {orders.length === 0 ? (
            <div className="p-12 rounded-2xl border border-slate-200 dark:border-amber-500/20 text-center space-y-4 bg-white dark:bg-slate-900/30 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  No Customer Card Orders Yet
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real card orders placed by users from the website checkout will automatically appear here in real time for laser engraving, chip programming, and courier fulfillment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((o) => {
                  if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
                  if (orderSearch && !o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) return false;
                  return true;
                })
                .map((order) => {
                  let address: any = {};
                  try {
                    address = JSON.parse(order.shippingAddress);
                  } catch { }

                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl border border-slate-200 dark:border-amber-500/15 bg-white dark:bg-[#0c101d] shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-black text-slate-900 dark:text-white">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
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
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-colors cursor-pointer"
                            >
                              Send to UV Print & Encode →
                            </button>
                          )}

                          {order.status === "production" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "qa")}
                              disabled={isUpdating}
                              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Send to QA Inspection →
                            </button>
                          )}

                          {order.status === "qa" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "ready_to_ship")}
                              disabled={isUpdating}
                              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
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
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Dispatch with BlueDart →
                            </button>
                          )}

                          {order.status === "shipped" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                              disabled={isUpdating}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              ✓ Mark Delivered
                            </button>
                          )}

                          {order.status === "delivered" && (
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
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
                  <option value="standard_pvc">Standard PVC NFC Card (₹999)</option>
                  <option value="custom_pvc">Customized PVC NFC Card (₹1,499)</option>
                  <option value="custom_metal">Customized Metal NFC Card (₹1,999)</option>
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

      {/* ======================================================== */}
      {/* TAB 7: USER SLOTS & SUBSCRIPTION QUOTAS                   */}
      {/* ======================================================== */}
      {activeTab === "slots" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>User Slots & Subscription Quotas</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage card slots for each user/workspace according to subscription plan. (1 user = 1 card baseline. Free=1, Starter=3, Professional=10, Business Pro=25). Extra slots can be allocated here or purchased by user.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email or workspace..."
                value={workspaceSearch}
                onChange={(e) => setWorkspaceSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-amber-500/15 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Total Workspaces</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{workspaces.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-amber-500/15 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Total Allotted Slots</div>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {workspaces.reduce((acc, w) => acc + (w.totalAllottedSlots || 1), 0)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-amber-500/15 shadow-xs">
              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Extra Paid/Granted Slots</div>
              <div className="text-2xl font-black text-emerald-500 mt-1">
                {workspaces.reduce((acc, w) => acc + (w.extraSlots || 0), 0)}
              </div>
            </div>
          </div>

          {/* Workspaces Slots Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-amber-500/20 bg-white dark:bg-slate-900/40 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-amber-500/20 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">User / Workspace</th>
                  <th className="py-3 px-4">Owner Email</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4 text-center">Plan Baseline</th>
                  <th className="py-3 px-4 text-center">Extra Slots</th>
                  <th className="py-3 px-4 text-center">Total Allotted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {workspaces
                  .filter(
                    (w) =>
                      w.name.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
                      w.slug.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
                      w.ownerEmail.toLowerCase().includes(workspaceSearch.toLowerCase())
                  )
                  .map((ws) => (
                    <tr key={ws.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{ws.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">/{ws.slug}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div className="font-medium">{ws.ownerEmail}</div>
                        <div className="text-[10px] text-slate-400">{ws.ownerName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ws.planCode || "free"}
                          onChange={(e) =>
                            handleAutoSaveSlot(ws.id, e.target.value, ws.extraSlots || 0)
                          }
                          disabled={savingSlotWsId === ws.id}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <option value="free">Free (1 Card)</option>
                          <option value="starter">Starter (3 Cards)</option>
                          <option value="professional">Professional (10 Cards)</option>
                          <option value="business_pro">Business Pro (25 Cards)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {ws.baseLimit || 1}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-white/10 shadow-xs">
                          <button
                            type="button"
                            onClick={() =>
                              handleAutoSaveSlot(
                                ws.id,
                                ws.planCode || "free",
                                Math.max(0, (ws.extraSlots || 0) - 1)
                              )
                            }
                            disabled={savingSlotWsId === ws.id || (ws.extraSlots || 0) <= 0}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Decrease extra slot"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={ws.extraSlots || 0}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                              handleAutoSaveSlot(ws.id, ws.planCode || "free", val);
                            }}
                            disabled={savingSlotWsId === ws.id}
                            className="w-12 text-center text-xs font-mono font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAutoSaveSlot(
                                ws.id,
                                ws.planCode || "free",
                                (ws.extraSlots || 0) + 1
                              )
                            }
                            disabled={savingSlotWsId === ws.id}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Increase extra slot"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-900 dark:text-amber-200 font-black border border-amber-500/30">
                          {(ws.baseLimit || 1) + (ws.extraSlots || 0)} Cards
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {savingSlotWsId === ws.id ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs animate-pulse border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Auto-Saving...</span>
                          </span>
                        ) : savedSlotWsId === ws.id ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20 animate-in fade-in">
                            <Check className="w-3.5 h-3.5" />
                            <span>Auto-Saved ✓</span>
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              Auto-Saves
                            </span>
                            <button
                              onClick={() => openAllocationModal(ws)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                              title="Detailed Allotment Modal"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: USER SUPPORT INQUIRIES & MESSAGES                  */}
      {/* ======================================================== */}
      {activeTab === "support" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <span>User Support Inquiries & Problem Messages</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All messages and problem reports submitted by users from the Help & Support center are logged here for executive resolution.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user messages or email..."
                  value={supportSearch}
                  onChange={(e) => setSupportSearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-0.5 shrink-0">
                {(["all", "open", "in_progress", "resolved"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSupportStatusFilter(filter)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      supportStatusFilter === filter
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {filter.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Support Tickets List */}
          {supportTickets.length === 0 ? (
            <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center space-y-3 bg-white dark:bg-slate-900/40">
              <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Support Messages Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When a user encounters any problem or submits a ticket in their Support page, their inquiry will appear here with instant resolution controls.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supportTickets
                .filter((t) => {
                  if (supportStatusFilter !== "all" && t.status !== supportStatusFilter) return false;
                  if (supportSearch) {
                    const q = supportSearch.toLowerCase();
                    return (
                      t.userName.toLowerCase().includes(q) ||
                      t.userEmail.toLowerCase().includes(q) ||
                      t.subject.toLowerCase().includes(q) ||
                      t.message.toLowerCase().includes(q) ||
                      t.id.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((ticket) => {
                  const isUpdating = updatingTicketId === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-amber-500/15 bg-white dark:bg-slate-900/50 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            {ticket.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {ticket.subject}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              ticket.status === "resolved"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                                : ticket.status === "in_progress"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                            }`}
                          >
                            {ticket.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {ticket.status !== "in_progress" && ticket.status !== "resolved" && (
                            <button
                              onClick={() => handleUpdateTicketStatus(ticket.id, "in_progress")}
                              disabled={isUpdating}
                              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              In Progress
                            </button>
                          )}
                          {ticket.status !== "resolved" && (
                            <button
                              onClick={() => handleUpdateTicketStatus(ticket.id, "resolved")}
                              disabled={isUpdating}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              ✓ Mark Resolved
                            </button>
                          )}
                          {ticket.status === "resolved" && (
                            <button
                              onClick={() => handleUpdateTicketStatus(ticket.id, "open")}
                              disabled={isUpdating}
                              className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Ticket Message Content */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                        {ticket.message}
                      </div>

                      {/* Ticket Reporter Metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Customer: {ticket.userName}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{ticket.userEmail}</span>
                        </div>
                        <div className="font-mono">
                          Submitted on {new Date(ticket.createdAt * 1000).toLocaleString("en-IN")}
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
      {/* SLOT ALLOCATION MODAL                                     */}
      {/* ======================================================== */}
      {allocatingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-amber-500/30 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  <span>Allot Slots & Plan Quota</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Workspace: <strong className="text-slate-900 dark:text-white">{allocatingWorkspace.name}</strong> ({allocatingWorkspace.ownerEmail})
                </p>
              </div>
              <button
                onClick={() => setAllocatingWorkspace(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Subscription Plan Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subscription Plan Tier (Base Slots)
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="free">Free Digital Identity (1 Slot Baseline)</option>
                  <option value="starter">Starter Plan (3 Slots)</option>
                  <option value="professional">Professional Plan (10 Slots)</option>
                  <option value="business_pro">Business Pro Plan (25 Slots)</option>
                </select>
              </div>

              {/* Extra Slots Add-on Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Additional Allotted Slots (Beyond Plan)
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 5, 10].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setSelectedExtraSlots((prev) => prev + inc)}
                        className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold hover:bg-amber-500/20 cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={selectedExtraSlots}
                  onChange={(e) => setSelectedExtraSlots(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Total Active Card Slots
                  </div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-300/80">
                    {selectedPlan === "free" ? 1 : selectedPlan === "starter" ? 3 : selectedPlan === "professional" ? 10 : 25} (Base Plan) + {selectedExtraSlots} (Extra)
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-500">
                  {(selectedPlan === "free" ? 1 : selectedPlan === "starter" ? 3 : selectedPlan === "professional" ? 10 : 25) + selectedExtraSlots}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setAllocatingWorkspace(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSlotAllocation}
                disabled={isAllocating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isAllocating ? "Saving..." : "Confirm & Save Allocation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
