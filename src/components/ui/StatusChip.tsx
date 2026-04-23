"use client";
import React from "react";

interface StatusChipProps {
  type: "pre-built" | "custom";
}

export function StatusChip({ type }: StatusChipProps) {
  const isPreBuilt = type === "pre-built";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
        isPreBuilt
          ? "bg-green-100 text-green-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {isPreBuilt ? "Pre-Built" : "Custom"}
    </span>
  );
}
