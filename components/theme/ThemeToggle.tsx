"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "pill";
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", size = "md", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch placeholder
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 opacity-50 ${
          size === "sm" ? "w-8 h-8" : size === "pill" ? "h-8 px-3" : "w-9 h-9"
        } ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (size === "pill" || showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          isDark
            ? "bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-400/50 shadow-xs shadow-amber-500/10"
            : "bg-amber-50 hover:bg-amber-100 text-slate-800 border-amber-300/80 hover:border-amber-400 shadow-xs"
        } ${className}`}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all cursor-pointer border ${
        size === "sm" ? "w-8 h-8" : "w-9 h-9"
      } ${
        isDark
          ? "bg-slate-900/90 hover:bg-slate-800 text-amber-400 border-white/10 hover:border-amber-400/40 shadow-xs"
          : "bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300 hover:border-indigo-400 shadow-xs"
      } ${className}`}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

