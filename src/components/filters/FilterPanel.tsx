"use client";
import React from "react";
import { useFilterStore } from "@/store/filterStore";
import type { FilterState, SubjectGroup, Level, TargetBand, ServiceType, MethodologyType, InventoryType } from "@/types/topic";

const SUBJECT_MAP: Record<SubjectGroup, string[]> = {
  STEM: ["Physics", "Chemistry", "Mathematics", "Biology"],
  "Applied STEM": ["Sports Science", "Physiology", "Environmental Systems", "Computer Science"],
};

type ChipGroupProps<T extends string | number> = {
  options: { label: string; value: T }[];
  active: T | null;
  onToggle: (v: T) => void;
  colorFn?: (v: T) => string;
};

function ChipGroup<T extends string | number>({ options, active, onToggle, colorFn }: ChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = active === opt.value;
        const customColor = colorFn?.(opt.value);
        return (
          <button
            key={String(opt.value)}
            onClick={() => onToggle(opt.value)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors duration-100 ${
              isActive
                ? customColor ?? "bg-navy text-white border-navy"
                : "bg-white text-charcoal/70 border-[#e2e8f0] hover:border-navy/40 hover:text-navy"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel() {
  const { filters, toggleFilter, resetFilters } = useFilterStore();

  const subjects = filters.subjectGroup
    ? SUBJECT_MAP[filters.subjectGroup].map((s) => ({ label: s, value: s }))
    : Object.values(SUBJECT_MAP)
        .flat()
        .map((s) => ({ label: s, value: s }));

  const bandColor = (v: number) => {
    if (v === 5) return "bg-amber-500 text-white border-amber-500";
    if (v === 6) return "bg-blue-600 text-white border-blue-600";
    return "bg-green-600 text-white border-green-600";
  };

  return (
    <aside className="w-60 shrink-0">
      <div
        className="sticky top-[56px] rounded-lg overflow-hidden border border-[#e2e8f0]"
        style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#e2e8f0] flex items-center justify-between bg-white">
          <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Filters</span>
          <button
            onClick={resetFilters}
            className="text-[10px] text-navy font-semibold hover:text-gold transition-colors uppercase tracking-wide"
          >
            Reset All
          </button>
        </div>

        <div className="bg-white divide-y divide-[#e2e8f0]">
          <Section label="Subject Group">
            <ChipGroup
              options={[
                { label: "STEM", value: "STEM" as SubjectGroup },
                { label: "Applied STEM", value: "Applied STEM" as SubjectGroup },
              ]}
              active={filters.subjectGroup}
              onToggle={(v) => toggleFilter("subjectGroup", v)}
            />
          </Section>

          <Section label="Subject">
            <ChipGroup
              options={subjects}
              active={filters.subject}
              onToggle={(v) => toggleFilter("subject", v)}
            />
          </Section>

          <Section label="Level">
            <ChipGroup
              options={[
                { label: "SL", value: "SL" as Level },
                { label: "HL", value: "HL" as Level },
              ]}
              active={filters.level}
              onToggle={(v) => toggleFilter("level", v)}
            />
          </Section>

          <Section label="Target Band">
            <ChipGroup
              options={[
                { label: "Band 5", value: 5 as TargetBand },
                { label: "Band 6", value: 6 as TargetBand },
                { label: "Band 7", value: 7 as TargetBand },
              ]}
              active={filters.targetBand}
              onToggle={(v) => toggleFilter("targetBand", v)}
              colorFn={bandColor}
            />
          </Section>

          <Section label="Service Type">
            <ChipGroup
              options={[
                { label: "IA", value: "IA" as ServiceType },
                { label: "EE", value: "EE" as ServiceType },
              ]}
              active={filters.serviceType}
              onToggle={(v) => toggleFilter("serviceType", v)}
            />
          </Section>

          <Section label="Methodology">
            <ChipGroup
              options={[
                { label: "Quantitative", value: "Quantitative" as MethodologyType },
                { label: "Qualitative", value: "Qualitative" as MethodologyType },
                { label: "Mixed", value: "Mixed" as MethodologyType },
              ]}
              active={filters.methodologyType}
              onToggle={(v) => toggleFilter("methodologyType", v)}
            />
          </Section>

          <Section label="Inventory Type">
            <ChipGroup
              options={[
                { label: "Pre-Built", value: "Pre-Built" as InventoryType },
                { label: "Custom", value: "Custom" as InventoryType },
              ]}
              active={filters.inventoryType}
              onToggle={(v) => toggleFilter("inventoryType", v)}
            />
          </Section>
        </div>
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  );
}
