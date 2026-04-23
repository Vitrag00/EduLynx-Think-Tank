"use client";
import React from "react";
import type { Topic } from "@/types/topic";
import { TopicCard } from "./TopicCard";

interface TopicCardGridProps {
  topics: Topic[];
}

export function TopicCardGrid({ topics }: TopicCardGridProps) {
  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mb-4">
          <span className="text-2xl text-navy/30">⊘</span>
        </div>
        <h3 className="text-base font-semibold text-charcoal/60 mb-1">No topics match your filters</h3>
        <p className="text-sm text-charcoal/40">Try adjusting or resetting your filters to see available pathways.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
