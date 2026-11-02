"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Crown,
  Briefcase,
  Smartphone,
  QrCode,
  Globe,
  ExternalLink,
  MessageCircle,
  Building2,
} from "lucide-react";

interface LeadsClientViewProps {
  initialLeads: any[];
  profiles: any[];
  workspaceId: string;
}

export function LeadsClientView({ initialLeads, profiles, workspaceId }: LeadsClientViewProps) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [roleTab, setRoleTab] = useState<"all" | "founder" | "employee">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadDetails, setLeadDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Founder profile is primary profile (profiles[0]), employee profiles are profiles.slice(1)
  const primaryProfile = profiles[0] || null;
  const employeeProfiles = profiles.slice(1);

  // Metrics
  const totalLeadsCount = leads.length;
  const founderLeadsCount = leads.filter((l) => primaryProfile && l.profileId === primaryProfile.id).length;
  const employeeLeadsCount = leads.filter((l) => !primaryProfile || l.profileId !== primaryProfile.id).length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  const isFounderLead = (lead: any) => {
    return Boolean(primaryProfile && lead.profileId === primaryProfile.id);
  };

  const getProfileForLead = (lead: any) => {
    return profiles.find((p) => p.id === lead.profileId);
  };

  const filteredLeads = leads.filter((lead) => {
    // 1. Role Filter Tab (Founder vs Employee vs All)
    if (roleTab === "founder" && !isFounderLead(lead)) return false;
    if (roleTab === "employee" && isFounderLead(lead)) return false;

    // 2. Status filter
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;

    // 3. Specific profile filter
    if (profileFilter !== "all" && lead.profileId !== profileFilter) return false;

    // 4. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.visitorName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.serviceInterest && lead.serviceInterest.toLowerCase().includes(q)) ||
        (lead.profileName && lead.profileName.toLowerCase().includes(q));
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
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "qualified":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "contacted":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "closed":
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";
      case "new":
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const renderSourceBadge = (sourceType: string, cardToken?: string) => {
    if (sourceType === "nfc") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
          <Smartphone className="w-3 h-3" />
          <span>NFC Tap {cardToken ? `(${cardToken})` : ""}</span>
        </span>
      );
    }
    if (sourceType === "qr") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
          <QrCode className="w-3 h-3" />
          <span>QR Scan</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-medium capitalize">
        <Globe className="w-3 h-3" />
        <span>{sourceType || "Direct Link"}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Lead CRM & Inquiries</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track inquiries, filter between Founder vs Employee leads, and manage your contact exchange pipeline.
          </p>
        </div>

        <a
          href="/api/leads/export"
          download
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 text-slate-300" />
          <span>Export to CSV</span>
        </a>
      </div>

      {/* METRIC SUMMARY CARDS (Clickable Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Leads Card */}
        <div
          onClick={() => {
            setRoleTab("all");
            setProfileFilter("all");
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            roleTab === "all" && profileFilter === "all"
              ? "bg-blue-50/80 dark:bg-blue-950/20 border-blue-500 shadow-md shadow-blue-500/10"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {totalLeadsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{convertedCount} converted</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">All Sources</span>
          </div>
        </div>

        {/* Founder Card Leads */}
        <div
          onClick={() => {
            setRoleTab("founder");
            if (primaryProfile) setProfileFilter(primaryProfile.id);
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            roleTab === "founder"
              ? "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-500 shadow-md shadow-indigo-500/10"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Founder Leads</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {founderLeadsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span className="truncate">{primaryProfile?.name || "Primary Card"}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {totalLeadsCount > 0 ? Math.round((founderLeadsCount / totalLeadsCount) * 100) : 0}% of Total
            </span>
          </div>
        </div>

        {/* Employee Card Leads */}
        <div
          onClick={() => {
            setRoleTab("employee");
            setProfileFilter("all");
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            roleTab === "employee"
              ? "bg-teal-50/80 dark:bg-teal-950/20 border-teal-500 shadow-md shadow-teal-500/10"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Employee Leads</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {employeeLeadsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{employeeProfiles.length} active employee card(s)</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              {totalLeadsCount > 0 ? Math.round((employeeLeadsCount / totalLeadsCount) * 100) : 0}% of Total
            </span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & DRILL-DOWN CONTROLS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        {/* Role Filter Tabs (Founder vs Employee vs All) */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setRoleTab("all");
              setProfileFilter("all");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              roleTab === "all"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Leads ({totalLeadsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleTab("founder");
              if (primaryProfile) setProfileFilter(primaryProfile.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              roleTab === "founder"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Founder Leads ({founderLeadsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleTab("employee");
              setProfileFilter("all");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              roleTab === "employee"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employee Leads ({employeeLeadsCount})</span>
          </button>
        </div>

        {/* Search & Dropdown Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search leads by visitor name, phone, email, service, or employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs pl-10 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>

            {/* Profile / Team Member Dropdown */}
            <select
              value={profileFilter}
              onChange={(e) => {
                setProfileFilter(e.target.value);
                if (e.target.value === "all") {
                  // Keep current role tab or default
                } else if (primaryProfile && e.target.value === primaryProfile.id) {
                  setRoleTab("founder");
                } else {
                  setRoleTab("employee");
                }
              }}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer max-w-[200px] truncate"
            >
              <option value="all">All Team Cards</option>
              {primaryProfile && (
                <option value={primaryProfile.id}>
                  👑 Founder: {primaryProfile.name}
                </option>
              )}
              {employeeProfiles.length > 0 && (
                <optgroup label="Employee Cards">
                  {employeeProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      👥 {p.name} {p.title ? `(${p.title})` : ""}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Clear filters button if active */}
            {(roleTab !== "all" || statusFilter !== "all" || profileFilter !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setRoleTab("all");
                  setStatusFilter("all");
                  setProfileFilter("all");
                  setSearchQuery("");
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Visitor Name</th>
                <th className="py-3.5 px-4">Captured Via / Role</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Service Interest</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-500 dark:text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                      No leads match your current filter.
                    </p>
                    <p className="text-xs text-slate-500">
                      {roleTab === "founder"
                        ? "No leads captured from the Founder profile yet."
                        : roleTab === "employee"
                        ? "No leads captured from Employee profiles yet."
                        : "When customers tap your NFC card or scan your QR, leads will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isFounder = isFounderLead(lead);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      onClick={() => handleOpenLead(lead)}
                    >
                      {/* Visitor Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{lead.visitorName}</span>
                        </div>
                      </td>

                      {/* Captured Via (Founder vs Employee Attribution) */}
                      <td className="py-3.5 px-4">
                        {isFounder ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-[10px] font-black w-fit">
                              <Crown className="w-3 h-3 text-amber-500" />
                              <span>Founder</span>
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                              {lead.profileName || primaryProfile?.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 text-[10px] font-bold w-fit">
                              <Briefcase className="w-3 h-3" />
                              <span>Employee</span>
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                              {lead.profileName}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="text-slate-900 dark:text-white font-semibold">{lead.phone}</div>
                        {lead.email && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans truncate max-w-[160px]">
                            {lead.email}
                          </div>
                        )}
                      </td>

                      {/* Channel Badge */}
                      <td className="py-3.5 px-4">
                        {renderSourceBadge(lead.sourceType, lead.cardToken)}
                      </td>

                      {/* Service Interest */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {lead.serviceInterest || "General Inquiry"}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer bg-white dark:bg-slate-900 transition-all ${getStatusBadge(
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

                      {/* Date Received */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {new Date(lead.createdAt * 1000).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAILS SLIDE-OVER MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedLead.status
                      )}`}
                    >
                      {selectedLead.status}
                    </span>
                    {renderSourceBadge(selectedLead.sourceType, selectedLead.cardToken)}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedLead.visitorName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLead(null);
                    setLeadDetails(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CARD ATTRIBUTION BANNER (Founder vs Employee) */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isFounderLead(selectedLead)
                    ? "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-500/30"
                    : "bg-teal-50/80 dark:bg-teal-950/20 border-teal-200 dark:border-teal-500/30"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isFounderLead(selectedLead)
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-teal-600 text-white shadow-xs"
                  }`}
                >
                  {isFounderLead(selectedLead) ? <Crown className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isFounderLead(selectedLead)
                          ? "bg-indigo-200 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200"
                          : "bg-teal-200 dark:bg-teal-900/50 text-teal-900 dark:text-teal-200"
                      }`}
                    >
                      {isFounderLead(selectedLead) ? "Founder Card Lead" : "Employee Card Lead"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedLead.profileName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Received through {selectedLead.sourceType === "nfc" ? "NFC smart tap" : "digital business card link"}
                  </p>
                </div>

                {selectedLead.profileSlug && (
                  <Link
                    href={`/p/${selectedLead.profileSlug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs shrink-0"
                    title="View card profile"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Direct Quick Contact Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Visitor</span>
                </a>

                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="sm:col-span-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    <span>Email {selectedLead.email}</span>
                  </a>
                )}
              </div>

              {/* Service Interest */}
              {selectedLead.serviceInterest && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Service / Product Interest:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {selectedLead.serviceInterest}
                  </p>
                </div>
              )}

              {/* Visitor Message */}
              {selectedLead.message && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Visitor Message:
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {/* Status Switcher */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Update Lead Pipeline Status:
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Internal Notes & Follow-up Timeline
                </h3>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal note or meeting update..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !newNote.trim()}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-2 pt-1">
                  {loadingDetails ? (
                    <p className="text-xs text-slate-500">Loading timeline...</p>
                  ) : leadDetails?.notes?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                  ) : (
                    leadDetails?.notes?.map((n: any) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-1 text-xs"
                      >
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{n.content}</p>
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
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] text-slate-500 space-y-0.5">
              <p>Contact Consent: Verified (v1) · Submission ID: {selectedLead.id.slice(0, 8)}</p>
              <p>Marketing Opt-in: {selectedLead.marketingConsent ? "Accepted" : "Declined / Unchecked"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
