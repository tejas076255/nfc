"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Edit3,
  Layers,
  Palette,
  Sliders,
  Share2,
  BarChart3,
  Users,
  CreditCard,
  Plug,
  ShoppingBag,
  Eye,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

interface ResponsiveSidebarProps {
  session: {
    user: {
      name: string;
      email: string;
      role: string;
    };
    workspace?: {
      id: string;
      name: string;
    } | null;
    membershipRole?: string;
  };
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
  primaryProfileId?: string;
}

export function ResponsiveSidebar({
  session,
  isAdmin,
  logoutAction,
  primaryProfileId,
}: ResponsiveSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname();

  // Track window hash for sub-sections
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
      const handleHashChange = () => setHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const profileEditorUrl = primaryProfileId
    ? `/dashboard/profiles/${primaryProfileId}/edit`
    : `/dashboard/profiles`;

  const navItems = [
    { id: "edit-profile", label: "Edit Profile", href: profileEditorUrl, icon: Edit3 },
    { id: "sections", label: "Sections", href: `${profileEditorUrl}#sections`, icon: Layers },
    { id: "appearance", label: "Appearance", href: `${profileEditorUrl}#appearance`, icon: Palette },
    { id: "settings", label: "Settings", href: `${profileEditorUrl}#settings`, icon: Sliders },
    { id: "seo", label: "SEO & Sharing", href: `${profileEditorUrl}#seo`, icon: Share2 },
    { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { id: "leads", label: "Leads / Enquiries", href: "/dashboard/leads", icon: Users },
    { id: "cards", label: "My NFC Cards", href: "/dashboard/cards", icon: CreditCard },
    { id: "team", label: "Team (Pro)", href: "/dashboard/billing?tab=team", icon: Users },
    { id: "integrations", label: "Integrations", href: "/dashboard/billing?tab=integrations", icon: Plug },
    { id: "billing", label: "Billing", href: "/dashboard/billing", icon: ShoppingBag },
    { id: "views", label: "Profile Views", href: "/dashboard/analytics?tab=views", icon: Eye },
    { id: "support", label: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  const isItemActive = (item: (typeof navItems)[0]) => {
    if (pathname.includes("/dashboard/profiles")) {
      if (pathname.includes("/edit")) {
        if (item.id === "sections") return hash === "#sections";
        if (item.id === "appearance") return hash === "#appearance";
        if (item.id === "settings") return hash === "#settings";
        if (item.id === "seo") return hash === "#seo";
        if (item.id === "edit-profile") {
          return !hash || hash === "#profile-header" || hash === "#" || hash === "";
        }
        return false;
      }
      // On /dashboard/profiles listing
      return item.id === "edit-profile";
    }

    if (pathname.startsWith("/dashboard/analytics")) {
      return item.id === "analytics";
    }

    if (pathname.startsWith("/dashboard/leads")) {
      return item.id === "leads";
    }

    if (pathname.startsWith("/dashboard/cards")) {
      return item.id === "cards";
    }

    if (pathname.startsWith("/dashboard/billing")) {
      return item.id === "billing";
    }

    if (pathname.startsWith("/dashboard/support")) {
      return item.id === "support";
    }

    return pathname === item.href;
  };

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#0a0f1d] text-slate-300">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              tap<span className="text-teal-400">bez</span>
            </span>
          </Link>

          {isAdmin && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Staff
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-blue-600/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Station Link */}
          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-purple-500/20">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Admin Console</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3.5 border-t border-white/5 bg-[#070b14]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-xs shrink-0 overflow-hidden shadow-xs">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {session.membershipRole === "owner" ? "Individual Plan" : `${session.membershipRole || "Free"} Plan`}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <Link
            href={profileEditorUrl}
            className="font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP NAVBAR (Visible only on < md) */}
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-[#0a0f1d] border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-white">
            tap<span className="text-teal-400">bez</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-64 max-w-[85vw] h-full bg-[#0a0f1d] border-r border-white/10 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR (Visible only on md+) */}
      <aside className="hidden md:flex w-60 border-r border-white/5 bg-[#0a0f1d] flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        {renderNavContent()}
      </aside>
    </>
  );
}
