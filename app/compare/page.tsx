"use client";
import React from "react";
import topicsData from "@/data/mockTopics.json";
import type { Topic } from "@/types/topic";
import { CompareTable } from "@/components/compare/CompareTable";

const allTopics = topicsData as Topic[];

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-navy mb-1">Compare Topics</h1>
        <p className="text-sm text-charcoal/50">
          Side-by-side comparison of up to 3 selected topics. Add topics from the Inventory Explorer.
        </p>
      </div>
      <CompareTable topics={allTopics} />
    </div>
  );
}
