import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY } from "@/lib/constants";

const COOKIE_CONFIG: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export function getAccessToken(): string | null {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
}

export function getRefreshToken(): string | null {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

export function setTokens(access: string, refresh: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, access, { ...COOKIE_CONFIG, expires: 1 });
  Cookies.set(REFRESH_TOKEN_KEY, refresh, { ...COOKIE_CONFIG, expires: 30 });
}

export function setAccessToken(access: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, access, { ...COOKIE_CONFIG, expires: 1 });
}

export function clearSession(): void {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_INFO_KEY, { path: "/" });
}

export function decodeToken<T = Record<string, unknown>>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken<{ exp?: number }>(token);
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}
