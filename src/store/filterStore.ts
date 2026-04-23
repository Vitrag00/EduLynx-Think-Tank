"use client";
import { create } from "zustand";
import type { FilterState, SubjectGroup, Level, TargetBand, ServiceType, MethodologyType, InventoryType } from "@/types/topic";

interface FilterStore {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  toggleFilter: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  resetFilters: () => void;
}

interface ShortlistStore {
  shortlistedIds: Set<string>;
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
}

interface CompareStore {
  compareIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

interface DrawerStore {
  selectedTopicId: string | null;
  isOpen: boolean;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
}

const defaultFilters: FilterState = {
  subjectGroup: null,
  subject: null,
  level: null,
  targetBand: null,
  serviceType: null,
  methodologyType: null,
  inventoryType: null,
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  toggleFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: state.filters[key] === value ? null : value,
      },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

export const useShortlistStore = create<ShortlistStore>((set, get) => ({
  shortlistedIds: new Set<string>(),
  toggleShortlist: (id) =>
    set((state) => {
      const next = new Set(state.shortlistedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { shortlistedIds: next };
    }),
  isShortlisted: (id) => get().shortlistedIds.has(id),
}));

export const useCompareStore = create<CompareStore>((set) => ({
  compareIds: [],
  addToCompare: (id) =>
    set((state) => {
      if (state.compareIds.includes(id) || state.compareIds.length >= 3)
        return state;
      return { compareIds: [...state.compareIds, id] };
    }),
  removeFromCompare: (id) =>
    set((state) => ({ compareIds: state.compareIds.filter((i) => i !== id) })),
  clearCompare: () => set({ compareIds: [] }),
}));

export const useDrawerStore = create<DrawerStore>((set) => ({
  selectedTopicId: null,
  isOpen: false,
  openDrawer: (id) => set({ selectedTopicId: id, isOpen: true }),
  closeDrawer: () => set({ isOpen: false, selectedTopicId: null }),
}));
