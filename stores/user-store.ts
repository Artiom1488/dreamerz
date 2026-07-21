"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/api/request-types";

interface UserStore {
  user: User | null;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "dreamerz-user",
      storage: createJSONStorage(() => localStorage),
      // Don't persist user data - React Query handles caching
      partialize: (state) => ({
        hasHydrated: state.hasHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
