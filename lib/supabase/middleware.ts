import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import {
  DEFAULT_UNAUTH_REDIRECT,
  DEFAULT_PENDING_REDIRECT,
  PROTECTED_ROUTES,
} from "@/constants/routes.constant";
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";

/**
 * Updates session and handles route protection with role-based gating.
 * - Unauthenticated users → redirect to /login
 * - Pending users accessing protected routes (except /pending) → redirect to /pending
 * - Denied users accessing protected routes (except /denied) → redirect to /denied
 * - Blocked users accessing protected routes (except /blocked) → redirect to /blocked
 * - Non-admin users accessing /admin/* → redirect to /dashboard (students to /search)
 * - Students accessing /dashboard → redirect to /search
 * - Approved users accessing /pending → redirect to /dashboard (students to /search)
 */
export async function updateSession(
  request: NextRequest,
  protectedRoutes: string[],
  initResponse?: NextResponse
) {
  const response = initResponse || NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const pathname = request.nextUrl.pathname;

  // Handle locale-prefixed routes (e.g., /en/dashboard, /ko/search)
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  const isProtected = protectedRoutes.some((pattern) => {
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return pathnameWithoutLocale === base || pathnameWithoutLocale.startsWith(`${base}/`);
    }
    return pathnameWithoutLocale === pattern || pathnameWithoutLocale.startsWith(`${pattern}/`);
  });

  // Not a protected route — allow
  if (!isProtected) return response;

  // Unauthenticated — redirect to login
  if (!claims) {
    const url = request.nextUrl.clone();
    // Preserve locale prefix if present
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? `/${localeMatch[1]}` : "";
    url.pathname = `${locale}${DEFAULT_UNAUTH_REDIRECT}`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Fetch profile for role check
  try {
    const userId = claims.sub as string;
    const result = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    const profile = result[0];

    // Helper to preserve locale prefix in redirects
    const getLocaleRedirect = (path: string) => {
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch ? `/${localeMatch[1]}` : "";
      url.pathname = `${locale}${path}`;
      return url;
    };

    if (!profile) {
      const url = getLocaleRedirect(DEFAULT_UNAUTH_REDIRECT);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Handle pending, rejected, and blocked users (based on approvalStatus)
    if (profile.approvalStatus === "pending") {
      if (pathnameWithoutLocale !== "/pending") {
        return NextResponse.redirect(getLocaleRedirect(DEFAULT_PENDING_REDIRECT));
      }
      return response;
    }

    if (profile.approvalStatus === "rejected") {
      if (pathnameWithoutLocale !== "/denied") {
        return NextResponse.redirect(getLocaleRedirect(PROTECTED_ROUTES.DENIED));
      }
      return response;
    }

    if (profile.approvalStatus === "blocked") {
      if (pathnameWithoutLocale !== "/blocked") {
        return NextResponse.redirect(getLocaleRedirect(PROTECTED_ROUTES.BLOCKED));
      }
      return response;
    }

    // Admin route check — only teacher, super_admin
    const isAdminRoute =
      pathnameWithoutLocale === "/admin" || pathnameWithoutLocale.startsWith("/admin/");
    const adminRoles = ["teacher", "super_admin"];

    if (isAdminRoute && !adminRoles.includes(profile.role)) {
      // Students redirect to search, others to dashboard
      const redirectPath = profile.role === "student" ? "/search" : "/dashboard";
      return NextResponse.redirect(getLocaleRedirect(redirectPath));
    }

    // Students trying to access dashboard — redirect to search
    if (profile.role === "student" && pathnameWithoutLocale === "/dashboard") {
      return NextResponse.redirect(getLocaleRedirect("/search"));
    }

    // Approved users trying to access /pending, /denied, or /blocked — redirect based on role
    if (
      pathnameWithoutLocale === "/pending" ||
      pathnameWithoutLocale === "/denied" ||
      pathnameWithoutLocale === "/blocked"
    ) {
      // Students redirect to search, others to dashboard
      const redirectPath = profile.role === "student" ? "/search" : "/dashboard";
      return NextResponse.redirect(getLocaleRedirect(redirectPath));
    }
  } catch (error) {
    console.error("Middleware role check failed:", error);
    // On error, allow request to proceed (fail-open for middleware, guards handle API)
  }

  return response;
}
