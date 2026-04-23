"use client";
import { useMemo } from "react";
import type { Topic } from "@/types/topic";
import { useFilterStore } from "@/store/filterStore";

export function useFilters(topics: Topic[]): Topic[] {
  const { filters } = useFilterStore();

  return useMemo(() => {
    return topics.filter((topic) => {
      if (filters.subjectGroup && topic.subjectGroup !== filters.subjectGroup) return false;
      if (filters.subject && topic.subject !== filters.subject) return false;
      if (filters.level && topic.level !== filters.level) return false;
      if (filters.targetBand && !topic.targetBand.includes(filters.targetBand)) return false;
      if (filters.serviceType && topic.serviceType !== filters.serviceType) return false;
      if (filters.methodologyType && topic.methodologyType !== filters.methodologyType) return false;
      if (filters.inventoryType && topic.inventoryType !== filters.inventoryType) return false;
      return true;
    });
  }, [topics, filters]);
}
