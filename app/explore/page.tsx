"use client";
import React, { useState, useEffect } from "react";
import fallbackTopics from "@/data/mockTopics.json";
import type { Topic } from "@/types/topic";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { TopicCardGrid } from "@/components/cards/TopicCardGrid";
import { TopicDrawer } from "@/components/detail/TopicDrawer";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useFilters } from "@/hooks/useFilters";
import { useCompareStore } from "@/store/filterStore";
import Link from "next/link";

function CompareTray({ allTopics }: { allTopics: Topic[] }) {
  const { compareIds, clearCompare } = useCompareStore();
  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e2e8f0] bg-white shadow-lg px-6 py-3 flex items-center gap-4">
      <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wide shrink-0">
        Compare ({compareIds.length}/3):
      </span>
      <div className="flex-1 flex gap-2 flex-wrap">
        {compareIds.map((id) => {
          const t = allTopics.find((x) => x.id === id);
          return t ? (
            <span
              key={id}
              className="bg-navy/10 text-navy text-xs font-medium px-2.5 py-1 rounded-full border border-navy/20"
            >
              {t.topicTitle.slice(0, 30)}{t.topicTitle.length > 30 ? "…" : ""}
            </span>
          ) : null;
        })}
      </div>
      <div className="flex gap-2 shrink-0">
        <Link
          href="/compare"
          className="bg-navy text-white text-xs font-semibold px-4 py-1.5 rounded hover:bg-navy-light transition-colors"
        >
          View Comparison →
        </Link>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-charcoal/50 border border-[#e2e8f0] px-3 py-1.5 rounded hover:bg-warm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function ExploreContent({ allTopics }: { allTopics: Topic[] }) {
  const filtered = useFilters(allTopics);

  return (
    <>
      <div className="flex gap-6 max-w-7xl mx-auto px-6 py-8">
        <FilterPanel />
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-navy">
              Inventory Explorer
              <span className="ml-2 text-sm font-normal text-charcoal/50">
                {filtered.length} topic{filtered.length !== 1 ? "s" : ""} found
              </span>
            </h1>
          </div>
          <ActiveFilterChips />
          <TopicCardGrid topics={filtered} />
        </div>
      </div>

      <TopicDrawer topics={allTopics} />
      <CompareTray allTopics={allTopics} />
    </>
  );
}

export default function ExplorePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => {
        if (!r.ok) throw new Error("API unavailable");
        return r.json();
      })
      .then((data: Topic[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTopics(data);
        } else {
          setTopics(fallbackTopics as Topic[]);
        }
      })
      .catch(() => {
        setTopics(fallbackTopics as Topic[]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 max-w-7xl mx-auto px-6 py-8">
        <div className="w-52 shrink-0" />
        <div className="flex-1">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return <ExploreContent allTopics={topics} />;
}
