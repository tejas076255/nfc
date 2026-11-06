"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "@/lib/auth/actions";
import { ArrowRight, Lock, Mail, User, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080a10] text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-teal-600 selection:text-white transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle size="sm" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/10">
              <Image
                src="/tapbez-emblem.png"
                alt="tapbez"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              tapbez<span className="text-teal-500">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
            Create your account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start with 1 free published profile, digital QR, and instant vCard
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-5 bg-white dark:bg-[#0b101c]">
          {state?.error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Siddharth Mehta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs pl-10 focus:outline-none focus:border-teal-500"
                />
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs pl-10 focus:outline-none focus:border-teal-500"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs pl-10 pr-10 focus:outline-none focus:border-teal-500"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPending ? "Creating Account..." : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
