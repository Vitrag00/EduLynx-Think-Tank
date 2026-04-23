"use client";
import React from "react";
import type { Topic } from "@/types/topic";
import { Badge } from "@/components/ui/Badge";
import { ScorePill } from "@/components/ui/ScorePill";
import { StatusChip } from "@/components/ui/StatusChip";
import { useDrawerStore, useShortlistStore, useCompareStore } from "@/store/filterStore";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const { openDrawer } = useDrawerStore();
  const { toggleShortlist, isShortlisted } = useShortlistStore();
  const { compareIds, addToCompare, removeFromCompare } = useCompareStore();

  const shortlisted = isShortlisted(topic.id);
  const inCompare = compareIds.includes(topic.id);
  const borderColor = topic.inventoryType === "Pre-Built" ? "#0B3C5D" : "#C9A24D";

  const bandVariant = topic.targetBand.includes(7)
    ? "band-7"
    : topic.targetBand.includes(6)
    ? "band-6"
    : "band-5";
  const bandLabel = topic.targetBand.includes(7)
    ? "Band 7"
    : topic.targetBand.includes(6)
    ? "Band 6"
    : "Band 5";

  return (
    <div
      className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
      style={{ borderTop: `3px solid ${borderColor}` }}
    >
      {/* Top row: status tag + shortlist */}
      <div className="flex items-center justify-between px-3 pt-3">
        <StatusChip type={topic.inventoryType === "Pre-Built" ? "pre-built" : "custom"} />
        <button
          onClick={() => toggleShortlist(topic.id)}
          className="text-lg leading-none transition-colors"
          aria-label="Toggle shortlist"
        >
          {shortlisted ? (
            <span className="text-gold">★</span>
          ) : (
            <span className="text-charcoal/25 hover:text-gold">☆</span>
          )}
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 px-3 pt-2">
        <Badge
          label={topic.level}
          variant={topic.level === "SL" ? "level-sl" : "level-hl"}
        />
        <Badge
          label={topic.serviceType}
          variant={topic.serviceType === "IA" ? "stream-IA" : "stream-EE"}
        />
        <Badge label={bandLabel} variant={bandVariant} />
      </div>

      {/* Title + subject */}
      <div className="px-3 pt-2">
        <h3 className="font-bold text-navy text-sm leading-snug line-clamp-2">
          {topic.topicTitle}
        </h3>
        <p className="text-xs text-charcoal/50 mt-0.5">{topic.subject}</p>
      </div>

      {/* Draft RQ */}
      <p className="px-3 mt-2 text-xs text-charcoal/70 italic line-clamp-2 leading-relaxed">
        {topic.draftRQ}
      </p>

      {/* Score pills */}
      <div className="grid grid-cols-2 gap-2 px-3 mt-3">
        <ScorePill score={topic.feasibility} type="feasibility" />
        <ScorePill score={topic.innovation} type="innovation" />
      </div>

      {/* Rationale */}
      <p className="px-3 mt-2 text-[11px] text-charcoal/55 line-clamp-1">{topic.rationale}</p>

      {/* Actions */}
      <div className="px-3 pb-3 mt-3 flex gap-2">
        <button
          onClick={() => openDrawer(topic.id)}
          className="flex-1 bg-navy text-white text-xs font-semibold py-1.5 rounded hover:bg-navy-light transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() =>
            inCompare ? removeFromCompare(topic.id) : addToCompare(topic.id)
          }
          className={`flex-1 text-xs font-semibold py-1.5 rounded border transition-colors ${
            inCompare
              ? "bg-navy/10 text-navy border-navy/30"
              : "bg-transparent text-navy border-navy hover:bg-navy/5"
          }`}
        >
          {inCompare ? "✓ Added" : "Compare"}
        </button>
      </div>
    </div>
  );
}
