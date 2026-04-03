import { create } from "zustand";

export const useNotesStore = create((set) => ({
  notes: [],
  searchQuery: "",
  setNotes: (notes = []) => set(() => ({ notes })),
  appendNotes: (notes = []) =>
    set((state) => ({ notes: [...state.notes, ...notes] })),
  setSearchQuery: (searchQuery = "") => set(() => ({ searchQuery })),
}));
