"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { authApi } from "../api/auth.api";
import { LoginCredentials } from "../types/auth.types";
import { getAccessToken, isTokenExpired } from "@/lib/auth/session";
import { canAccess } from "@/lib/auth/access-control";
import { PermissionType, RoleType } from "@/config/permissions.config";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout } =
    useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (!token || isTokenExpired(token)) {
        storeLogout();
        return;
      }

      if (!user) {
        try {
          const profile = await authApi.getCurrentUser();
          setUser(profile);
        } catch {
          storeLogout();
        }
      }
    };

    initAuth();
  }, [user, setUser, storeLogout]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const { user: loggedInUser } = await authApi.login(credentials);
        setUser(loggedInUser);
        return loggedInUser;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
      storeLogout();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, setLoading, storeLogout]);

  const checkAccess = useCallback(
    (options: { roles?: RoleType[]; permissions?: PermissionType[] }) => {
      return canAccess(user, options);
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAccess,
  };
}
