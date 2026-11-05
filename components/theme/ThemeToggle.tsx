"use client";

import React from "react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "pill";
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", size = "md", showLabel = false }: ThemeToggleProps) {
  // Website is strictly locked to Light Mode; global toggle is hidden
  return null;
}
