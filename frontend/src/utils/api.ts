// utils/api.ts
import { Context, useState } from "react";
import { client } from "./useApi";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ContextRegister, ContextUpdate, UpdateProfile, User, UserRegister } from "../types/enum";
import { validadeForm } from "../utils/User";

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
            const validation = validadeForm('login', { email, password });
            if (!validation.valid) {
                throw new Error(Object.values(validation.errors).join('\n'));
            }

            const response = await client(null).request(
                'POST',
                "/auth/login",
                { email, password }
            );

            const { access_token } = response || {};
            if (!access_token) {
                throw new Error("Credenciais inválidas");
            }

            setLogin(access_token);
            return access_token;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Erro inesperado";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function update(user: UpdateProfile, context: ContextUpdate | null = null): Promise<any> {
        setLoading(true);
        setError(null);

        try {


            let path = "/users/me";

            if (!context) throw new Error("Desculpe, tente novamente.");

            switch (context?.origin) {
                case 'table':
                    if (context?.userRequest?.role !== 'admin') throw new Error("Acesse seu perfil para fazer alterações.");
                    path = `/admin/users/update/${context?.userId ?? 'undefined'}`;
                    break;
                case 'profile':
                    if (context?.userRequest?.id !== context?.userId) throw new Error("Erro ao atualizar seus dados");
                    break;
                default:
                    break;
            }

            
            const validation = validadeForm('update', user);
            if (!validation.valid) {
                throw new Error(Object.values(validation.errors).join('\n'));
            }

            const fullName = user.surname
                ? `${user.name} ${user.surname}`
                : user.name;

            const dataUpdate: Record<string, any> = {
                name: fullName,
                email: user.email
            };

            if (user.password && user.password.trim()) {
                dataUpdate.password = user.password;
            }

            const response = await client(accessToken).request(
                'PATCH',
                `${path}`,
                dataUpdate
            );

            if (!response?.success) {
                throw new Error(response?.message || "Falha na atualização");
            }

            return response;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Erro na atualização";
            setError(msg);

            if (err.response?.data) {
                return err.response?.data;
            }

            return {
                success: false,
                message: err.message || "Erro desconhecido",
            };

        } finally {
            setLoading(false);
        }
    }

    async function removeUser(id: User["id"], context: Pick<User, "id" | "role">){
        setLoading(true);
        setError(null);

        try {

            if (!context) throw new Error("Desculpe, tente novamente.");

            if(id !== context?.id){
                if (context?.role !== 'admin') throw new Error("Você não pode executar essa função.");
            }
  
            const response = await client(accessToken).request(
                'DELETE',
                `/admin/users/delete/${id}`,
                {}
            );

            if (!response?.success) {
                throw new Error(response?.message || "Falha na requisição");
            }

            return response;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Erro na atualização";
            setError(msg);

            if (err.response?.data) {
                return err.response?.data;
            }

            return {
                success: false,
                message: err.message || "Erro desconhecido",
            };

        } finally {
            setLoading(false);
        }
    }

    async function register({
        name,
        email,
        password,
        confirm_password,
        role = 'user'
    }: UserRegister,
        context: ContextRegister | null = null
    ): Promise<any> {
        setLoading(true);
        setError(null);

        try {

            let path = "/auth/register";

            if (!context) throw new Error("Desculpe, tente novamente.");

            switch (context?.origin) {
                case 'table':
                    if (context?.userRequest?.role !== 'admin') throw new Error("Desculpe, você não tem permissões necessárias.");
                    path = '/admin/users/create';
                    break;
                default:
                    break;
            }


            const validation = validadeForm('register', {
                name,
                email,
                password,
                confirm_password
            });

            if (!validation.valid) {
                throw new Error(Object.values(validation.errors).join('\n'));
            }

            const response = await client(null).request(
                'POST',
                `${path}`,
                { name, email, password }
            );

            if (!response.success) {
                throw new Error(response.message || "Falha no registro");
            }

            return response;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Erro na atualização";
            setError(msg);

            if (err.response?.data) {
                return err.response?.data;
            }

            return {
                success: false,
                message: err.message || "Erro desconhecido",
            };

        } finally {
            setLoading(false);
        }
    }

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
                '/admin/users/list',
                { role, sortBy, order }
            );

            return response || [];

        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                logout();
                navigate('/login', { replace: true });
            }

            const msg = err.response?.data?.message || err.message || "Erro ao buscar usuários";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        register,
        update,
        removeUser,
        fetchUsers,
        loading,
        error,
        setError
    };
}