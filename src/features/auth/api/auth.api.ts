import apiClient from "@/lib/axios/api-client";
import { API_ENDPOINTS } from "@/lib/axios/api-endpoints";
import { handleApiError } from "@/lib/axios/api-error";
import {
  LoginCredentials,
  TokenResponse,
  User,
  JWTPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth.types";
import {
  clearSession,
  decodeToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/session";
import { ROLES } from "@/config/permissions.config";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: TokenResponse }> {
    try {
      const response = await apiClient.post<TokenResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const tokens = response.data;
      setTokens(tokens.access, tokens.refresh);

      const decoded = decodeToken<JWTPayload>(tokens.access);

      const user: User = tokens.user || {
        id: decoded?.user_id || 1,
        email: decoded?.email || credentials.email || "user@example.com",
        first_name: decoded?.first_name || "Admin",
        last_name: decoded?.last_name || "User",
        role: decoded?.role || ROLES.ADMIN,
        is_active: true,
      };

      return { user, tokens };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ detail: string }> {
    try {
      const response = await apiClient.post<{ detail: string }>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ detail: string }> {
    try {
      const response = await apiClient.post<{ detail: string }>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
