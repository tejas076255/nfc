"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Package,
  Layers,
  Cpu,
  History,
  LogOut,
  Menu,
  X,
  BarChart3,
  Smartphone,
  CreditCard,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface ResponsiveAdminSidebarProps {
  session: {
    user: {
      name: string;
      email: string;
      role: string;
    };
  };
  logoutAction: () => Promise<void>;
}

export function ResponsiveAdminSidebar({ session, logoutAction }: ResponsiveAdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

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
    { id: "overview", label: "Executive Overview", icon: BarChart3, href: "/admin?tab=overview" },
    {
      id: "orders",
      label: "Card Orders & Fulfillment",
      icon: Package,
      href: "/admin?tab=orders",
      badge: "Orders",
    },
    {
      id: "slots",
      label: "User Slots & Plans",
      icon: CreditCard,
      href: "/admin?tab=slots",
      badge: "Quota",
    },
    {
      id: "support",
      label: "Support Inquiries & Logs",
      icon: MessageSquare,
      href: "/admin?tab=support",
    },
    { id: "profiles", label: "Profiles Directory", icon: Smartphone, href: "/admin?tab=profiles" },
    { id: "qa", label: "NFC Chip QA Terminal", icon: Cpu, href: "/admin?tab=qa" },
    { id: "inventory", label: "Hardware Mint Batch", icon: Layers, href: "/admin?tab=inventory" },
    { id: "logs", label: "Security Audit Logs", icon: History, href: "/admin?tab=logs" },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full bg-[#fafbfc] dark:bg-[#07090f] transition-colors border-r border-slate-200 dark:border-amber-500/15">
      <div>
        {/* Admin Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-amber-500/15 flex items-center justify-between bg-white/80 dark:bg-gradient-to-r dark:from-[#0d121f] dark:to-[#07090f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 flex items-center justify-center p-1 shadow-md shadow-amber-500/10">
              <Image
                src="/tapbez-emblem.png"
                alt="tapbez"
                width={26}
                height={26}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>tapbez</span>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                  EXEC
                </span>
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase block">
                Command Terminal
              </span>
            </div>
          </div>
          <ThemeToggle size="sm" />
        </div>

        {/* Role & Operator Status Card */}
        <div className="p-4 border-b border-slate-200 dark:border-amber-500/15 bg-amber-500/5 dark:bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Privileged Access</span>
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40">
              {session.user.role}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 truncate">
            {session.user.name}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {session.user.email}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-amber-400/60">
            Operations Console
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "text-amber-900 dark:text-amber-200 bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-amber-500/30 text-amber-900 dark:text-amber-100 border border-amber-500/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-amber-500/15 bg-slate-50 dark:bg-[#07090f]">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-amber-500/20 transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Operator</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE NAVBAR */}
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-white/95 dark:bg-[#07090f]/95 backdrop-blur-xl border-b border-slate-200 dark:border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 flex items-center justify-center p-1 shadow-xs">
            <Image
              src="/tapbez-emblem.png"
              alt="tapbez"
              width={22}
              height={22}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            tapbez <span className="text-amber-500">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 dark:text-amber-300 dark:hover:text-white border border-slate-200 dark:border-amber-500/30 transition-colors"
            aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#07090f] border-r border-slate-200 dark:border-amber-500/20 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-amber-500/20 bg-white dark:bg-[#07090f] flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto shadow-sm">
        {renderNavContent()}
      </aside>
    </>
  );
}
