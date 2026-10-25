"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronRight,
  X,
  Plus,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";

interface LeadsClientViewProps {
  initialLeads: any[];
  profiles: any[];
  workspaceId: string;
}

export function LeadsClientView({ initialLeads, profiles, workspaceId }: LeadsClientViewProps) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadDetails, setLeadDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (profileFilter !== "all" && lead.profileId !== profileFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.visitorName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.serviceInterest && lead.serviceInterest.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenLead = async (lead: any) => {
    setSelectedLead(lead);
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`);
      const data = (await res.json()) as any;
      setLeadDetails(data.lead);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      // Refresh lead details
      const detailRes = await fetch(`/api/leads/${selectedLead.id}`);
      const data = (await detailRes.json()) as any;
      setLeadDetails(data.lead);
      setNewNote("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddingNote(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "qualified":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "contacted":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "closed":
        return "bg-slate-800 text-slate-400 border-slate-700";
      case "new":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Lead CRM Inbox
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track inquiries, update contact pipelines, and view source attribution.
          </p>
        </div>

        <a
          href="/api/leads/export"
          download
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export All to CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search leads by name, phone, email, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs pl-10 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="all">All Profiles</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Service Interest</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No leads matching your current filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-900/40 cursor-pointer transition-colors"
                    onClick={() => handleOpenLead(lead)}
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      {lead.visitorName}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>{lead.phone}</div>
                      {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {lead.serviceInterest || "General Inquiry"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-[10px] border border-white/5">
                        {lead.sourceType} {lead.cardToken ? `(${lead.cardToken})` : ""}
                      </span>
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer bg-slate-900 ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(lead.createdAt * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenLead(lead)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAILS SLIDE-OVER MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg h-full bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      selectedLead.status
                    )}`}
                  >
                    {selectedLead.status}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">{selectedLead.visitorName}</h2>
                  <p className="text-xs text-slate-400">
                    Profile: {selectedLead.profileName} · Source: {selectedLead.sourceType}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setLeadDetails(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                {selectedLead.email ? (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email Visitor</span>
                  </a>
                ) : (
                  <div className="py-2.5 px-4 rounded-xl bg-slate-800/40 text-slate-500 text-xs font-semibold flex items-center justify-center">
                    No Email Provided
                  </div>
                )}
              </div>

              {/* Message Details */}
              {selectedLead.message && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Visitor Message:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedLead.message}</p>
                </div>
              )}

              {/* Status Switcher in Details */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Update Lead Pipeline Status:
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Notes Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Internal Notes & Timeline
                </h3>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal note or follow-up update..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !newNote.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {loadingDetails ? (
                    <p className="text-xs text-slate-500">Loading timeline...</p>
                  ) : leadDetails?.notes?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                  ) : (
                    leadDetails?.notes?.map((n: any) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1 text-xs"
                      >
                        <p className="text-slate-200">{n.content}</p>
                        <p className="text-[10px] text-slate-500">
                          {n.authorName || "Staff"} · {new Date(n.createdAt * 1000).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Consent Audit Notice Footer */}
            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[10px] text-slate-500 space-y-0.5">
              <p>Contact Consent: Verified (Notice v1) · Submission Key: {selectedLead.id.slice(0, 8)}</p>
              <p>Marketing Opt-in: {selectedLead.marketingConsent ? "Accepted" : "Declined / Unchecked"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
