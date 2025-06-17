// src/contexts/AuthContext.tsx
import { createContext, ReactNode, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const PrivateContext = createContext<boolean | null | undefined>(null);

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { isSignIn, loading, setLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof isSignIn === 'undefined') return;
        if (!isSignIn) {
            navigate("/auth/login", { replace: true });
            setLoading(false);
        }
    }, [isSignIn]);

    if (!isSignIn && loading) {
        return (
            <Loading />
        )
    }

    if (isSignIn) {
        return (
            <PrivateContext.Provider value={isSignIn}>
                {children}
            </PrivateContext.Provider>
        );
    }
}