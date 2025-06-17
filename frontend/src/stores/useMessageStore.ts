// src/stores/useMessageStore.ts
import { create } from "zustand";

export type MomentMessage = {
    type: 'error' | 'success' | 'warning',
    message: string
} 

interface MessageState {
    momentMessage: MomentMessage | null | undefined;
    setMessage: (msg: MomentMessage) => void;
    clearMessage: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    momentMessage: null,
    setMessage: (obj: MomentMessage) => set({ momentMessage: obj}),
    clearMessage: () => set({ momentMessage: null}),
}));
