"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wifi,
  LayoutDashboard,
  CreditCard,
  QrCode,
  Users,
  BarChart3,
  ShoppingBag,
  Sliders,
  LogOut,
  ShieldCheck,
  Sparkles,
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
}

export function ResponsiveSidebar({ session, isAdmin, logoutAction }: ResponsiveSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Digital Profiles", href: "/dashboard/profiles", icon: Sliders },
    { label: "My NFC Cards", href: "/dashboard/cards", icon: CreditCard },
    { label: "QR Code Engine", href: "/dashboard/qr", icon: QrCode },
    { label: "Lead CRM", href: "/dashboard/leads", icon: Users },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Card Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Subscription & Billing", href: "/dashboard/billing", icon: Sparkles },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Wifi className="w-4 h-4 text-white rotate-90" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                TapSync<span className="text-blue-500">.</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                User Workspace
              </span>
            </div>
          </Link>

          {isAdmin && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Staff
            </span>
          )}
        </div>

        {/* Active Workspace Info */}
        <div className="p-4 border-b border-white/10 bg-slate-900/40">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Active Workspace
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white truncate max-w-[150px]">
              {session.workspace?.name || "Workspace"}
            </span>
            {session.membershipRole && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize shrink-0">
                {session.membershipRole}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-blue-600/15 text-white border border-blue-500/30 shadow-sm shadow-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Station Link (for operations and staff) */}
          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-purple-500/20">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wide">
                    Super Admin Portal
                  </span>
                </div>
                <p className="text-[10px] text-purple-300/80 leading-snug">
                  Hardware factory minting, QA inspection, and global order fulfillment.
                </p>
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                >
                  <span>Open Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* User Footer / Logout */}
      <div className="p-4 border-t border-white/10 bg-slate-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{session.user.email}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP NAVBAR (Visible only on < md) */}
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Wifi className="w-3.5 h-3.5 text-white rotate-90" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            TapSync<span className="text-blue-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {session.workspace?.name && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 truncate max-w-[120px]">
              {session.workspace.name}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
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
          <div className="relative w-72 max-w-[85vw] h-full bg-[#07090e] border-r border-white/10 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR (Visible only on md+) */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        {renderNavContent()}
      </aside>
    </>
  );
}
