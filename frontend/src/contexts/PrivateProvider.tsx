// src/contexts/AuthContext.tsx
import { createContext, ReactNode, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const PrivateContext = createContext<boolean | null | undefined>(null);

export default function ProtectedLayout() {
    const { isSignIn, loading, logout, setLoading, accessToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof isSignIn === 'undefined') return;

        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();

                if (isExpired) {
                    logout();
                    navigate("/auth/login", { replace: true });
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error("Failed to parse JWT", e);
                logout();
                navigate("/auth/login", { replace: true });
                setLoading(false);
                return;
            }
        }

        if (!isSignIn) {
            navigate("/auth/login", { replace: true });
            setLoading(false);
        }
    }, [isSignIn, accessToken]);


    if (!isSignIn && loading) {
        return (
            <Loading />
        )
    }

    if (isSignIn) {
        return (
            <PrivateContext.Provider value={isSignIn}>
                <Outlet />
            </PrivateContext.Provider>
        );
    }
}