// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthState } from "../types/enum"

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isSignIn: false,
            user: null,
            accessToken: null,
            loading: true,
            setLoading: (b: boolean) => {
                set({ loading: b});
            },
            setLogin: (token: string) => {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const user = {
                    id: payload.sub,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                };
                set({ user, accessToken: token, isSignIn: true});
                localStorage.setItem("access_token", token);
            },
            logout: () => {
                set({ user: null, accessToken: null, isSignIn: false });
               // alert('logout');
                localStorage.removeItem("access_token");
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
