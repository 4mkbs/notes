import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setUser: (user) => set(() => ({ user })),
      setAccessToken: (accessToken) => set(() => ({ accessToken })),
    }),
    {
      name: "auth-storage",
    }
  )
);
