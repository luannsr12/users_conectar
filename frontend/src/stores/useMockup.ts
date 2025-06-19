// src/stores/useMockup.ts
import { create } from "zustand";

type MockupState = {
    isMobile: boolean;
    toggleIsMobile: () => void;
};

const localStorageKey = "mockupPhone";

export const useMockup = create<MockupState>((set) => ({
    isMobile: typeof window !== "undefined"
        ? localStorage.getItem(localStorageKey) === "dark"
        : false,

    toggleIsMobile: () => set((state) => {
        const newMode = !state.isMobile;
        if (typeof window !== "undefined") {
            localStorage.setItem(localStorageKey, newMode ? "dark" : "light");
        }
        return { isMobile: newMode };
    }),
}));
