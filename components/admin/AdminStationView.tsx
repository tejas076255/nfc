"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

export function AdminStationView({
  orders: initialOrders,
  cards: initialCards,
  auditLogs,
}: {
  orders: AdminOrder[];
  cards: AdminCard[];
  auditLogs: AuditLogItem[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "qa" | "logs">("orders");

  // Orders State
  const [orders, setOrders] = useState(initialOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Batch Inventory Generator State
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

  // Feedback Notification
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter Search
  const [searchQuery, setSearchQuery] = useState("");

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
      setAlert({
        type: "success",
        text: `Successfully generated ${data.count} factory card records with cryptographic claim secrets.`,
      });
      router.refresh();
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to generate batch" });
    } finally {
      setGeneratingBatch(false);
    }
  };

  const downloadBatchCsv = () => {
    if (!generatedBatch || generatedBatch.length === 0) return;
    const headers = ["Card ID", "Public Token", "NDEF Redirect URL", "Claim Secret", "Product Variant"];
    const rows = generatedBatch.map((c) => [
      c.id,
      c.publicToken,
      c.ndefUrl,
      c.claimSecret,
      c.variant,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tapsync_nfc_factory_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecordQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaCardToken) return;

    setQaLoading(true);
    setAlert(null);

    // Find card by public token
    const targetCard = initialCards.find(
      (c) => c.publicToken.toLowerCase() === qaCardToken.trim().toLowerCase()
    );

    if (!targetCard) {
      setAlert({ type: "error", text: `No card found with token '${qaCardToken}'. Check token spelling.` });
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
          readbackUrl: `https://tapsync.co/t/${targetCard.publicToken}`,
          verifiedQrToken: targetCard.publicToken,
          notes: qaNotes,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Failed to submit QA record");

      setAlert({
        type: "success",
        text: `QA Record logged! Card ${targetCard.publicToken} status updated.`,
      });
      setQaCardToken("");
      setQaNotes("");
      router.refresh();
    } catch (err: any) {
      setAlert({ type: "error", text: err.message || "Failed to record QA" });
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Message */}
      {alert && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span className="text-sm font-medium">{alert.text}</span>
        </div>
      )}

      {/* ADMIN TABS NAVIGATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fulfillment & Dispatch ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("qa")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "qa"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hardware Encoding & QA Station</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "inventory"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Factory Batch Generator</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "logs"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security & Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: ORDER FULFILLMENT */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Physical Card Production Queue</h2>
              <p className="text-xs text-slate-400">
                Move cards from verified payment through UV printing, NDEF encoding, and BlueDart dispatch.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {orders
              .filter((o) =>
                o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((order) => {
                let address: any = {};
                try {
                  address = JSON.parse(order.shippingAddress);
                } catch {}

                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-extrabold text-white">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Ordered on {new Date(order.createdAt * 1000).toLocaleString("en-IN")} • Amount: ₹
                          {order.totalAmountInr}
                        </p>
                      </div>

                      {/* State Transition Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {order.status === "paid" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "production")}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-colors"
                          >
                            Send to UV Print & Encode
                          </button>
                        )}

                        {order.status === "production" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "qa")}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition-colors"
                          >
                            Send to QA Inspection
                          </button>
                        )}

                        {order.status === "qa" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "ready_to_ship")}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow transition-colors"
                          >
                            Pack & Ready to Ship
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
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-colors"
                          >
                            Dispatch with BlueDart
                          </button>
                        )}

                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Details & Shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                        <div className="font-bold text-slate-300 uppercase tracking-wider">Item Details</div>
                        <div className="text-white">
                          Variant: <strong className="capitalize">{order.cardVariant.replace("_", " ")}</strong>
                        </div>
                        <div className="text-slate-400">Quantity: {order.quantity} physical card(s)</div>
                        {order.trackingNumber && (
                          <div className="text-blue-400 pt-1">
                            Courier: {order.trackingCarrier} (<strong>{order.trackingNumber}</strong>)
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                        <div className="font-bold text-slate-300 uppercase tracking-wider">Shipping Destination</div>
                        <div className="text-white font-medium">{address.fullName || "Customer"}</div>
                        <div className="text-slate-400">
                          {address.street}, {address.city}, {address.state} {address.postalCode}
                        </div>
                        <div className="text-slate-400">Phone: {address.phone}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: HARDWARE QA STATION */}
      {activeTab === "qa" && (
        <div className="space-y-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-lg font-bold text-white">Hardware Encoding & Inspection Station</h2>
            <p className="text-xs text-slate-400">
              Perform simulated cryptographic read-back verification on NTAG213 chips. Confirm the public redirect URL matches the printed QR token before customer dispatch.
            </p>
          </div>

          <form
            onSubmit={handleRecordQa}
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl max-w-xl space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Scan or Enter Card Token
              </label>
              <input
                type="text"
                placeholder="e.g. t_7d8a9f..."
                value={qaCardToken}
                onChange={(e) => setQaCardToken(e.target.value)}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Inspection Stage
                </label>
                <select
                  value={qaStep}
                  onChange={(e) => setQaStep(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ndef_readback">NDEF Readback Test</option>
                  <option value="qr_mapping">QR Mapping Match</option>
                  <option value="visual_print">Visual Print Quality</option>
                  <option value="final_pass">Final QA Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Inspection Verdict
                </label>
                <select
                  value={qaResult}
                  onChange={(e) => setQaResult(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="pass">PASS (Certified)</option>
                  <option value="fail">FAIL (Quarantine)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Station Notes
              </label>
              <input
                type="text"
                placeholder="e.g. NFC chip antenna capacitance verified. Edge alignment clean."
                value={qaNotes}
                onChange={(e) => setQaNotes(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={qaLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
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
        </div>
      )}

      {/* TAB 3: BATCH FACTORY INVENTORY */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Factory Card Batch Provisioning</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Generate batches of unassigned NFC cards. Each card receives an unguessable HTTPS redirect token and a single-use claim secret. Download the CSV file for printing and retail packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batchQty}
                  onChange={(e) => setBatchQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Card Variant
                </label>
                <select
                  value={batchVariant}
                  onChange={(e) => setBatchVariant(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="standard_pvc">Standard Gloss PVC</option>
                  <option value="matte_pvc">Premium Matte PVC</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateBatch}
              disabled={generatingBatch}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {generatingBatch ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Generate Cryptographic Batch</span>
                </>
              )}
            </button>
          </div>

          {generatedBatch && generatedBatch.length > 0 && (
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-300">
                    Batch Ready: {generatedBatch.length} Cards Provisioned
                  </h3>
                  <p className="text-xs text-slate-400">
                    Download factory printing manifest containing NDEF redirect URLs and scratch-off claim secrets.
                  </p>
                </div>

                <button
                  onClick={downloadBatchCsv}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download Factory CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">System Audit & Compliance Trail</h2>
            <p className="text-xs text-slate-400">
              Immutable logs for security events, card claims, permissions, and webhook executions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(log.createdAt * 1000).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      <span className="font-bold text-white">{log.actorRole}</span> ({log.actorId.slice(0, 8)}...)
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-400">{log.action}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{log.resourceType}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] truncate max-w-xs">
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
