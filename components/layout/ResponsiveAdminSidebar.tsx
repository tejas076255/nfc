"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Admin Station Header */}
        <div className="h-16 px-6 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950/40 to-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">
                Admin Console<span className="text-purple-400">.</span>
              </span>
              <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase block">
                Super Admin & QA
              </span>
            </div>
          </div>
        </div>

        {/* Role Status Badge */}
        <div className="p-4 border-b border-purple-500/20 bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
              Staff Authorization
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {session.user.role}
            </span>
          </div>
          <p className="text-xs font-semibold text-white mt-1 truncate">
            {session.user.name}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {session.user.email}
          </p>
        </div>

        {/* Admin Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Operations Control
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-purple-200 bg-purple-900/30 border border-purple-500/30 shadow-sm transition-all"
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span>Orders & Fulfillment</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Hardware Factory Mint</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>NFC Chip QA Terminal</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Security Audit Logs</span>
          </Link>

          {/* Switch to User Workspace Section */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Switch Portal
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-950/40 border border-blue-500/20 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>User Workspace</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Admin Footer & Logout */}
      <div className="p-4 border-t border-purple-500/20 bg-slate-950">
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
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 bg-slate-950/95 backdrop-blur-xl border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/30 text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Admin Console<span className="text-purple-400">.</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 transition-colors"
          aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#06080e] border-r border-purple-500/20 z-50 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-purple-500/20 bg-slate-950/90 backdrop-blur-2xl flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto shadow-2xl">
        {renderNavContent()}
      </aside>
    </>
  );
}
