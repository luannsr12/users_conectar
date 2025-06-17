// src/stores/useThemeStore.ts
import { create } from "zustand";

type ThemeState = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const localStorageKey = "theme";

export const useThemeStore = create<ThemeState>((set) => ({
    darkMode: typeof window !== "undefined"
        ? localStorage.getItem(localStorageKey) === "dark"
        : false,

    toggleDarkMode: () => set((state) => {
        const newMode = !state.darkMode;
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, newMode ? "dark" : "light");
        }
        return { darkMode: newMode };
    }),
}));
