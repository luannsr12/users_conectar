// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para verificar se token expirou
    function isTokenExpired(token) {
        try {
            const { exp } = jwtDecode(token);
            return exp < Date.now() / 1000;
        } catch {
            return true;
        }
    }

    // Lê token do localStorage e atualiza user
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token && !isTokenExpired(token)) {
            const payload = jwtDecode(token);
            setUser({
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            });

            setAccessToken(token);
            setLoading(false);

            // Agenda logout automático para quando expirar
            const timeLeft = payload.exp * 1000 - Date.now();
            const timeout = setTimeout(() => {
                logout();
            }, timeLeft);

            return () => clearTimeout(timeout);
        } else {
            logout();
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("access_token", token);
        const payload = jwtDecode(token);
        setUser({
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        });

        // Agenda logout automático com base no novo token
        const timeLeft = payload.exp * 1000 - Date.now();
        const timeout = setTimeout(() => {
            logout();
        }, timeLeft);

        return () => clearTimeout(timeout);
    };

    const logout = () => {
        
        localStorage.removeItem("access_token");
        setUser(null);
        setAccessToken(null);
        navigate('/login');

    };

    return (
        <AuthContext.Provider value={{ user, login, logout, accessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
