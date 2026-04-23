"use client";
import React from "react";

interface DropdownFilterProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function DropdownFilter({ label, options, value, onChange }: DropdownFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#e2e8f0] rounded px-3 py-2 text-sm text-charcoal bg-white focus:outline-none focus:border-navy transition-colors"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
