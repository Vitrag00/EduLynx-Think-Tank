"use client";
import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { useCompareStore } from "@/store/filterStore";
import { Badge } from "@/components/ui/Badge";

const FIELDS: { key: keyof Topic | "bandLabel"; label: string }[] = [
  { key: "topicTitle", label: "Topic Title" },
  { key: "subject", label: "Subject" },
  { key: "subjectGroup", label: "Subject Group" },
  { key: "level", label: "Level" },
  { key: "serviceType", label: "Service" },
  { key: "bandLabel", label: "Target Band" },
  { key: "feasibility", label: "Feasibility" },
  { key: "innovation", label: "Innovation" },
  { key: "methodologyType", label: "Methodology" },
  { key: "complexity", label: "Complexity" },
  { key: "recommendedFor", label: "Recommended For" },
  { key: "riskFlags", label: "Risk Flags" },
  { key: "estimatedHours", label: "Est. Hours" },
];

interface CompareTableProps {
  topics: Topic[];
}

export function CompareTable({ topics: allTopics }: CompareTableProps) {
  const { compareIds, removeFromCompare, clearCompare } = useCompareStore();
  const topics = allTopics.filter((t) => compareIds.includes(t.id));

  const getBandLabel = (topic: Topic) => {
    if (topic.targetBand.includes(7)) return "Band 7";
    if (topic.targetBand.includes(6)) return "Band 6";
    return "Band 5";
  };

  const getCellValue = (topic: Topic, key: keyof Topic | "bandLabel"): React.ReactNode => {
    if (key === "bandLabel") return getBandLabel(topic);
    const raw = topic[key as keyof Topic];
    if (Array.isArray(raw)) {
      return (
        <div className="flex flex-col gap-1">
          {(raw as string[]).map((r, i) => (
            <span key={i} className="text-xs text-charcoal/70">
              · {r}
            </span>
          ))}
        </div>
      );
    }
    if (key === "feasibility" || key === "innovation") {
      const num = raw as number;
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-navy">{num}/10</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-16">
            <div
              className={`h-full rounded-full ${key === "feasibility" ? "bg-blue-500" : "bg-gold"}`}
              style={{ width: `${num * 10}%` }}
            />
          </div>
        </div>
      );
    }
    if (key === "estimatedHours") return `${raw}h`;
    return String(raw ?? "—");
  };

  if (compareIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-4">
          <span className="text-3xl text-navy/20">⇄</span>
        </div>
        <h3 className="text-lg font-semibold text-charcoal/60 mb-2">No topics selected for comparison</h3>
        <p className="text-sm text-charcoal/40 mb-6">Add topics from the Inventory Explorer to compare side by side.</p>
        <Link
          href="/explore"
          className="bg-navy text-white px-6 py-2 rounded text-sm font-semibold hover:bg-navy-light transition-colors"
        >
          Go to Explorer
        </Link>
      </div>
    );
  }

  const emptySlots = 3 - topics.length;

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-charcoal/60">
          Comparing {topics.length} topic{topics.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={clearCompare}
          className="text-xs text-charcoal/50 hover:text-charcoal border border-[#e2e8f0] px-3 py-1.5 rounded hover:bg-warm transition-colors"
        >
          Clear All
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-36 p-3 text-left text-[10px] font-bold text-charcoal/40 uppercase tracking-widest bg-warm border border-[#e2e8f0]">
              Dimension
            </th>
            {topics.map((topic) => (
              <th
                key={topic.id}
                className="p-3 text-left bg-navy border border-[#e2e8f0] min-w-48"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge
                        label={topic.level}
                        variant={topic.level === "SL" ? "level-sl" : "level-hl"}
                      />
                      <Badge
                        label={topic.serviceType}
                        variant={topic.serviceType === "IA" ? "stream-IA" : "stream-EE"}
                      />
                    </div>
                    <p className="text-white font-semibold text-xs leading-snug">{topic.topicTitle}</p>
                    <p className="text-white/50 text-[10px] mt-0.5">{topic.subject}</p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(topic.id)}
                    className="text-white/40 hover:text-white text-base leading-none shrink-0 transition-colors mt-0.5"
                    aria-label="Remove from compare"
                  >
                    ×
                  </button>
                </div>
              </th>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <th
                key={`empty-${i}`}
                className="p-3 bg-warm border border-dashed border-[#e2e8f0] min-w-48"
              >
                <Link
                  href="/explore"
                  className="flex flex-col items-center justify-center py-4 text-charcoal/30 hover:text-navy transition-colors"
                >
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs font-medium">Add topic from Explorer</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELDS.map((field, idx) => (
            <tr key={field.key} className={idx % 2 === 0 ? "bg-white" : "bg-warm/60"}>
              <td className="p-3 text-xs font-semibold text-charcoal/60 border border-[#e2e8f0] align-top whitespace-nowrap">
                {field.label}
              </td>
              {topics.map((topic) => (
                <td key={topic.id} className="p-3 text-xs text-charcoal/80 border border-[#e2e8f0] align-top">
                  {getCellValue(topic, field.key)}
                </td>
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <td key={`empty-cell-${i}`} className="p-3 border border-dashed border-[#e2e8f0]" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
