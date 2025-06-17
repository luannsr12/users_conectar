// types/enum.ts
import { ComponentType } from "react";

export interface User {
    id: string | number;
    name: string;
    email: string;
    role: string;
    last_login: string | null;
    createdAt: string;
    updatedAt: string;
    status?: string; // statusUser may add this
}

export type AccessToken = string | null;

export type UpdateProfile = {
  name: User['name'];
  email: User['email'];
  password?: string | false | null;
  confirm_password?: string | false | null;
}

export type AuthState = {
    isSignIn?: boolean;
    user: Pick<User, "id" | "name" | "email" | "role"> | null;
    accessToken: string | null;
    loading: boolean;
    setLogin: (token: string) => void;
    logout: () => void;
    setLoading: (b: boolean) => void; 
  };

export interface RouteConfig {
    path: string;
    element: ComponentType;
    isPublic: boolean;
  }