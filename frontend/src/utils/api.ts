// utils/api.ts
import { useState } from "react";
import { client } from "./useApi";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { UpdateProfile } from "../types/enum";

export function apiHttp() {
    const setLogin = useAuthStore((state) => state.setLogin);
    const logout = useAuthStore((state) => state.logout);
    const accessToken = useAuthStore((state) => state.accessToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function login(email: string, password: string): Promise<string> {
        setLoading(true);
        setError(null);
        try {
            if (!email.trim() || !password.trim()) {
                throw new Error("Preencha todos os campos");
            }

            const response = await client(null).request(
                'POST',
                "/auth/login",
                { email, password }
            );

            const { success, access_token } = response || {};
            if (!success || !access_token) {
                throw new Error("Dados de login inválidos");
            }

            setLogin(access_token);
            return access_token;

        } catch (err: any) {

            let msg = err.response?.message || err.message || "Erro inesperado";

            if (Array.isArray(msg)) {
                msg = msg.join('\n');
            }

            if (typeof msg !== 'string') {
                msg = String(msg);
            }

            setError(msg);
            throw new Error(msg);

        } finally {
            setLoading(false);
        }
    }

    async function update(user: UpdateProfile): Promise<boolean> {
        setLoading(true);
        setError(null);

        const { name, email, password, confirm_password } = user;

        try {
            // Validação campos não vazios
            if (![name, email].every(field => field.trim())) {
                throw new Error("Campos de nome e email são obrigatórios.");
            }

            // Nome precisa ter pelo menos duas palavras
            if (name.trim().split(/\s+/).length < 2) {
                throw new Error("Informe nome e sobrenome");
            }

            // Validação simples de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Email inválido");
            }

            if (password && confirm_password) {
                // Senha com pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
                const passwordRegex = /^(?=.*\d).{6,}$/;
                if (!passwordRegex.test(password)) {
                    throw new Error("A senha deve ter pelo menos 6 caracteres e conter ao menos um número");
                }

                // Confirmação de senha
                if (password !== confirm_password) {
                    throw new Error("As senhas não coincidem");
                }
            }

            let dataUpdate = {
                name,
                email,
                ...(password ? { password } : {}),
            }

            // Chamada API
            const response = await client(accessToken).request(
                'PATCH',
                "/users/me",
                dataUpdate
            );

            const { success } = response || {};
            if (!success) {
                throw new Error("Falha no registro");
            }

            return true;

        } catch (err: any) {
            const msg = err.response?.message || err.message || "Erro inesperado";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    async function register(
        name: string,
        email: string,
        password: string,
        confirm_password: string
    ): Promise<boolean> {
        setLoading(true);
        setError(null);

        try {
            // Validação campos não vazios
            if (![name, email, password, confirm_password].every(field => field.trim())) {
                throw new Error("Preencha todos os campos");
            }

            // Nome precisa ter pelo menos duas palavras
            if (name.trim().split(/\s+/).length < 2) {
                throw new Error("Informe nome e sobrenome");
            }

            // Validação simples de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Email inválido");
            }

            // Senha com pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
            const passwordRegex = /^(?=.*\d).{6,}$/;
            if (!passwordRegex.test(password)) {
                throw new Error("A senha deve ter pelo menos 6 caracteres e conter ao menos um número");
            }

            // Confirmação de senha
            if (password !== confirm_password) {
                throw new Error("As senhas não coincidem");
            }

            // Chamada API
            const response = await client(null).request(
                'POST',
                '/auth/register',
                { name, email, password }
            );

            const { success } = response.data || {};
            if (!success) {
                throw new Error("Falha no registro");
            }

            return true;

        } catch (err: any) {
            const msg = err.response?.message || err.message || "Erro inesperado";
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
            const response = await client(accessToken).request(
                'GET',
                '/admin/users',
                { role, sortBy, order }
            );

            return response; // deve ser lista de usuários já filtrada

        } catch (err: any) {

            const status = err.response?.status;
            if (status === 401 || status === 403) {
                //logout();
                // navigate('/login', { replace: true });
                return null;
            }

            const msg = err.response?.data?.message || err.message || "Erro inesperado";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    return { login, register, update, fetchUsers, loading, setError, error };
}
