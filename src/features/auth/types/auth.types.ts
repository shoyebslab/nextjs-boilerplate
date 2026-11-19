import { RoleType, PermissionType } from "@/config/permissions.config";

export interface User {
  id: string | number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  role: RoleType;
  permissions?: PermissionType[];
  avatar?: string;
  is_active: boolean;
  date_joined?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface JWTPayload {
  token_type: "access" | "refresh";
  exp: number;
  iat: number;
  jti: string;
  user_id: string | number;
  email?: string;
  role?: RoleType;
  first_name?: string;
  last_name?: string;
}
