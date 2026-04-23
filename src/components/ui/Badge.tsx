"use client";
import React from "react";

type BadgeVariant =
  | "level-sl"
  | "level-hl"
  | "stream-IA"
  | "stream-EE"
  | "band-5"
  | "band-6"
  | "band-7"
  | "pre-built"
  | "custom";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  "level-sl": "bg-blue-100 text-navy border border-blue-200",
  "level-hl": "bg-navy text-blue-100 border border-navy",
  "stream-IA": "bg-navy/10 text-navy border border-navy/30",
  "stream-EE": "bg-blue-600/10 text-blue-700 border border-blue-600/30",
  "band-5": "bg-amber-100 text-amber-800 border border-amber-300",
  "band-6": "bg-blue-100 text-blue-800 border border-blue-300",
  "band-7": "bg-green-100 text-green-800 border border-green-300",
  "pre-built": "bg-green-100 text-green-800 border border-green-300",
  custom: "bg-amber-100 text-amber-800 border border-amber-300",
};

export function Badge({ label, variant, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
