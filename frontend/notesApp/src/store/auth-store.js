import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setUser: (user) => set((state) => ({ user })),
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
    }),
    {
      name: "auth-storage",
    }
  )
);
