// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthState } from "../types/enum"
import { useMessageStore } from "../stores/useMessageStore";
import { showToast } from "../utils/swal";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuthStore();
    const { setMessage, momentMessage, clearMessage } = useMessageStore();

    useEffect(() => {
        if (momentMessage?.type && momentMessage?.message) {
            showToast(momentMessage?.type, momentMessage?.message, 5000);
            clearMessage();
        }
    }, [momentMessage, clearMessage]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth precisa estar dentro do AuthProvider");
    return context;
}