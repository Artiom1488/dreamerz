"use client";

import { create } from "zustand";

interface UiStore {
  errorMessage: string;
  showLoader: boolean;
  bgLoader: boolean;
  setErrorMessage: (message: string) => void;
  setShowLoader: (value: boolean) => void;
  setBgLoader: (value: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  errorMessage: "",
  showLoader: false,
  bgLoader: false,
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setShowLoader: (showLoader) => set({ showLoader }),
  setBgLoader: (bgLoader) => set({ bgLoader }),
}));