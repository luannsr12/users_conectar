// types/enum.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    last_login: string | null;
    createdAt: string;
    updatedAt: string;
    status?: string; // statusUser may add this
}
