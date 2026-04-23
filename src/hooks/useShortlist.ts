"use client";
import { useShortlistStore } from "@/store/filterStore";

export function useShortlist() {
  return useShortlistStore();
}
