// utils/useApi.ts
import { useState } from "react";
import { api } from "./requestInstance";
import { useAuth } from "../contexts/AuthContext";

export function useApi() {
    const { login: setLoginAuth, accessToken, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function login(email: string, password: string): Promise<string> {
        setLoading(true);
        setError(null);
        try {
            if (!email.trim() || !password.trim()) {
                throw new Error("Preencha todos os campos");
            }

            const response = await api.post(
                "/auth/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const { success, access_token } = response.data || {};
            if (!success || !access_token) {
                throw new Error("Dados de login inválidos");
            }

            setLoginAuth(access_token);
            return access_token;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Erro inesperado";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Busca usuários da API admin/users com filtro de role, sort e order.
     * @param {object} params
     * @param {string} params.role - "admin" | "user" | undefined
     * @param {string} params.sortBy - "name" | "createdAt"
     * @param {string} params.order - "asc" | "desc"
     */
    async function fetchUsers({
        role,
        sortBy = "name",
        order = "asc",
    }: {
        role?: string;
        sortBy?: "name" | "createdAt";
        order?: "asc" | "desc";
    } = {}) {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/admin/users", {
                params: { role, sortBy, order },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
              });
            return response.data; // deve ser lista de usuários já filtrada
        } catch (err: any) {

            const status = err.response?.status;
            if (status === 401 || status === 403) {
                logout();
                return;
            }

            const msg = err.response?.data?.message || err.message || "Erro inesperado";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    return { login, fetchUsers, loading, error };
}
