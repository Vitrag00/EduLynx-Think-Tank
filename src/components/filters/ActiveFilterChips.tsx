"use client";
import React from "react";
import { useFilterStore } from "@/store/filterStore";
import type { FilterState } from "@/types/topic";

const LABELS: Record<keyof FilterState, string> = {
  subjectGroup: "Group",
  subject: "Subject",
  level: "Level",
  targetBand: "Band",
  serviceType: "Service",
  methodologyType: "Method",
  inventoryType: "Type",
};

export function ActiveFilterChips() {
  const { filters, setFilter } = useFilterStore();

  const activeEntries = Object.entries(filters).filter(([, v]) => v !== null) as [
    keyof FilterState,
    string | number
  ][];

  if (activeEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-charcoal/50 font-medium">Active:</span>
      {activeEntries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 bg-navy/10 text-navy border border-navy/20 rounded-full px-2.5 py-0.5 text-xs font-medium"
        >
          <span className="text-navy/60">{LABELS[key]}:</span>
          {key === "targetBand" ? `Band ${value}` : String(value)}
          <button
            onClick={() => setFilter(key, null)}
            className="ml-0.5 text-navy/50 hover:text-navy transition-colors leading-none"
            aria-label={`Remove ${key} filter`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
