"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Package,
  Layers,
  Cpu,
  History,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  BarChart3,
  Smartphone,
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
    { id: "overview", label: "System Overview", icon: BarChart3, href: "/admin?tab=overview" },
    { id: "profiles", label: "Profiles Directory", icon: Smartphone, href: "/admin?tab=profiles" },
    { id: "orders", label: "Orders & Fulfillment", icon: Package, href: "/admin?tab=orders" },
    { id: "qa", label: "NFC Chip QA Terminal", icon: Cpu, href: "/admin?tab=qa" },
    { id: "inventory", label: "Hardware Factory Mint", icon: Layers, href: "/admin?tab=inventory" },
    { id: "logs", label: "Security Audit Logs", icon: History, href: "/admin?tab=logs" },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-slate-950/95 transition-colors">
      <div>
        {/* Admin Station Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-purple-500/20 flex items-center justify-between bg-slate-50/80 dark:bg-gradient-to-r dark:from-purple-950/40 dark:to-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/25 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
                Admin Console<span className="text-purple-600 dark:text-purple-400">.</span>
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold tracking-wider uppercase block">
                Super Admin & QA
              </span>
            </div>
          </div>
          <ThemeToggle size="sm" />
        </div>

        {/* Role Status Badge */}
        <div className="p-4 border-b border-slate-200 dark:border-purple-500/20 bg-purple-50/60 dark:bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-300">
              Staff Authorization
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40">
              {session.user.role}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate">
            {session.user.name}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {session.user.email}
          </p>
        </div>

        {/* Admin Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Operations Control
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "text-purple-700 dark:text-purple-200 bg-purple-100/80 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500/30 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Switch to User Workspace Section */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Switch Portal
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>User Workspace</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Admin Footer & Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors shadow-xs cursor-pointer"
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
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/25 text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Console<span className="text-purple-600 dark:text-purple-400">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 dark:hover:text-white border border-slate-200 dark:border-purple-500/30 transition-colors"
            aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#06080e] border-r border-slate-200 dark:border-purple-500/20 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-purple-500/20 bg-white dark:bg-slate-950/90 backdrop-blur-2xl flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto shadow-sm">
        {renderNavContent()}
      </aside>
    </>
  );
}
