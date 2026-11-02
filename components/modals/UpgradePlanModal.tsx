"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Check,
  ShieldCheck,
  Zap,
  Users,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  currentCount?: number;
  profileLimit?: number;
  customTitle?: string;
  customDescription?: string;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  planName = "Current",
  currentCount = 1,
  profileLimit = 1,
  customTitle,
  customDescription,
}: UpgradePlanModalProps) {
  if (!isOpen) return null;

  const isUnlimited = profileLimit >= 999;
  const usagePercentage = isUnlimited ? 10 : Math.min(100, Math.round((currentCount / profileLimit) * 100));

  const upgradeFeatures = [
    {
      title: "Unlimited Digital Cards & Employee Profiles",
      desc: "Create and deploy profiles for your entire team with custom roles and shared branding.",
      icon: Users,
    },
    {
      title: "Real-Time CRM & Webhook Automation",
      desc: "Instant live stream sync into Google Sheets, Zapier, HubSpot, and WhatsApp alerts.",
      icon: Zap,
    },
    {
      title: "Custom Domain & White-Label Branding",
      desc: "Host profiles on cards.yourdomain.com with zero TapSync badges.",
      icon: ShieldCheck,
    },
    {
      title: "Bulk Hardware NFC Cards with Chip QA",
      desc: "Order custom metal and matte PVC contactless NFC cards encoded at factory grade.",
      icon: CreditCard,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Top Decorative Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-full inline-block">
                  Quota Reached
                </span>
                <h2 className="text-xl font-black tracking-tight mt-0.5">
                  {customTitle || "Unlock More Digital Profiles"}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Current Quota Usage Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{planName} Plan Quota</span>
                <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                  {currentCount} of {isUnlimited ? "Unlimited" : profileLimit} Used (100%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {customDescription ||
                  `You have reached the maximum profile limit for your ${planName} plan. Upgrade to Business Pro to immediately add more team members, employee cards, and premium ecosystem automations.`}
              </p>
            </div>

            {/* Features Included in Upgrade */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                What You Get When You Upgrade
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {upgradeFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{feat.title}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/dashboard/billing"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Upgrade Plan & Add Slots</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

