import { create } from "zustand";

export const useNotesStore = create((set) => ({
  notes: [],
  setNotes: (notes = []) => set((state) => ({ notes })),
}));
