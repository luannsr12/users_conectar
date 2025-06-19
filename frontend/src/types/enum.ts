// types/enum.ts
import { ComponentType } from "react";

/**
 * API Types
 */
export interface ApiTypes {
  methods: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "UPLOAD";
}


/**
 * User Types
 */
export interface BaseUser {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user";
  last_login: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Password = string | false | null;

export interface User extends BaseUser {
  status?: string;
}

export type UserStatus = "online" | "offline" | "active" | "inactive";

export interface UserWithStatus extends BaseUser {
  status: UserStatus;
}

export interface UserWithPassword extends BaseUser {
  password?: Password;
}

export interface UserRegister {
  name: BaseUser["name"],
  email: BaseUser["email"],
  role: BaseUser["role"],
  password: Password,
  confirm_password?: Password
}

/**
 * Authentication Types
 */
export type AccessToken = string | null;

export interface AuthState {
  isSignIn?: boolean;
  user: Pick<BaseUser, "id" | "name" | "email" | "role" | "createdAt" | "updatedAt"> | null;
  accessToken: AccessToken;
  loading: boolean;
  setLogin: (token: string) => void;
  logout: () => void;
  setLoading: (b: boolean) => void;
  setName: (n: string) => void;
  setEmail: (e: string) => void;
}

/**
 * Profile Management Types
 */
export interface ProfileBase {
  name?: string;
  email: string;
  role?: string;
}

export interface UpdateProfile extends ProfileBase {
  surname?: string | null;
  password?: Password
  confirm_password?: Password
}

export interface ContextUpdate {
  origin: "table" | "profile",
  userRequest: Pick<BaseUser, "id" | "role">,
  userId: BaseUser["id"]
}

export interface ContextRegister {
  origin: "table" | "auth",
  userRequest: Pick<BaseUser, "id" | "role"> | null | undefined,
}

/**
 * Form Validation Types
 */
export type FormValidationType =
  | "register"
  | "login"
  | "update"
  | "forgot-password";

export type FormAccount = UpdateProfile | null;

export interface ValidationResult<T = Omit<FormAccount, 'confirm_password'>> {
  valid: boolean;
  errors: Record<string, string>;
  data?: T;
}

/**
 * Routing Types
 */
export interface RouteItem {
  path: string;
  element: ComponentType;
}

export interface RouteConfig {
  public: RouteItem[];
  private: RouteItem[];
  admin: RouteItem[];
}