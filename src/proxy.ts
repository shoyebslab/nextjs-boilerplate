import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_KEY } from "./lib/constants";
import { ROLES, RoleType } from "./config/permissions.config";

const ROLE_RESTRICTED_ROUTES: Record<string, RoleType[]> = {
  "/dashboard/roles": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "/dashboard/permissions": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "/dashboard/settings": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "/dashboard/users/create": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  const isAuthenticated = Boolean(accessToken);
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 1. If accessing Auth route while logged in -> redirect to Dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. If accessing Dashboard route while unauthenticated -> redirect to Login
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
