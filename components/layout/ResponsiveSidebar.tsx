"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Smartphone,
  Edit3,
  QrCode,
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
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
  planName?: string;
}

export function ResponsiveSidebar({
  session,
  isAdmin,
  logoutAction,
  primaryProfileId,
  planName,
}: ResponsiveSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    { id: "profiles", label: "Digital Profiles", href: "/dashboard/profiles", icon: Smartphone },
    { id: "edit-profile", label: "Profile Studio", href: profileEditorUrl, icon: Edit3 },
    { id: "qr", label: "QR Code", href: "/dashboard/qr", icon: QrCode },
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
    if (pathname === "/dashboard/profiles" || pathname === "/dashboard/profiles/new") {
      return item.id === "profiles";
    }

    if (pathname.includes("/dashboard/profiles") && pathname.includes("/edit")) {
      return item.id === "edit-profile";
    }

    if (pathname.startsWith("/dashboard/qr")) {
      return item.id === "qr";
    }

    if (pathname.startsWith("/dashboard/cards")) {
      return item.id === "cards";
    }

    if (pathname.startsWith("/dashboard/billing")) {
      const tab = searchParams?.get("tab");
      if (tab === "team") return item.id === "team";
      if (tab === "integrations") return item.id === "integrations";
      return item.id === "billing";
    }

    if (pathname.startsWith("/dashboard/support")) {
      return item.id === "support";
    }

    return pathname === item.href;
  };

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-[#0a0f1d] text-slate-700 dark:text-slate-300 transition-colors">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              tap<span className="text-teal-600 dark:text-teal-400">bez</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            {isAdmin && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30">
                Staff
              </span>
            )}
          </div>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive
                    ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-white border border-blue-500/30 dark:border-blue-500/40 shadow-xs shadow-blue-500/10 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Admin Console</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3.5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#070b14]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-teal-500/15 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-600 dark:text-teal-300 text-xs shrink-0 overflow-hidden shadow-xs">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{session.user.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {planName ? `${planName}` : session.membershipRole === "owner" ? "Individual Plan" : `${session.membershipRole || "Free"} Plan`}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <Link
            href={profileEditorUrl}
            className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 flex items-center gap-1"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 cursor-pointer"
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
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            tap<span className="text-teal-600 dark:text-teal-400">bez</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-64 max-w-[85vw] h-full bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-white/10 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR (Visible only on md+) */}
      <aside className="hidden md:flex w-60 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0f1d] flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto transition-colors">
        {renderNavContent()}
      </aside>
    </>
  );
}
