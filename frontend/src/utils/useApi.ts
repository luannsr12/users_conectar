// utils/requestInstance.ts
import axios, { AxiosInstance } from "axios";
import { AccessToken, ApiTypes } from "../types/enum";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export type Method = ApiTypes["methods"];

export const api = (token: string | null = null) => {
    const client: AxiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (token?.trim()) {
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return {
        async request(
            method: Method,
            path: string,
            payload?: any,
            context?: { headers?: Record<string, string>; token?: string }
        ) {
            try {
                if (context?.headers) {
                    Object.entries(context.headers).forEach(([key, value]) => {
                        client.defaults.headers.common[key] = value;
                    });
                }

                switch (method) {
                    case "GET":
                        return (await client.get(path, { params: payload }))?.data;
                    case "POST":
                        return (await client.post(path, payload))?.data;
                    case "PATCH":
                        return (await client.patch(path, payload))?.data;
                    case "PUT":
                        return (await client.put(path, payload))?.data;
                    case "DELETE":
                        return (await client.delete(path, { data: payload }))?.data;
                    case "UPLOAD":
                        if (payload instanceof FormData) {
                            return (
                                await client.post(path, payload, {
                                    headers: { "Content-Type": "multipart/form-data" },
                                })
                            )?.data;
                        }
                        throw new Error("UPLOAD requer FormData");
                    default:
                        throw new Error(`Método não suportado: ${method}`);
                }
            } catch (error) {
                if (error.response?.data) {
                    return error.response.data;
                }
                return {
                    success: false,
                    message: error.message || "Erro desconhecido",
                };
            }
        },
    };
};

export const client = (token: AccessToken | null) => {
    return api(token);
};