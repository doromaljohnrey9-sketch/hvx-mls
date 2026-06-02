import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { DEFAULT_UNAUTH_REDIRECT, DEFAULT_PENDING_REDIRECT } from "@/constants/routes.constant";
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";

/**
 * Updates session and handles route protection with role-based gating.
 * - Unauthenticated users → redirect to /login
 * - Pending users accessing protected routes (except /pending) → redirect to /pending
 * - Non-admin users accessing /admin/* → redirect to /dashboard
 */
export async function updateSession(request: NextRequest, protectedRoutes: string[]) {
  const response = NextResponse.next({ request });
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

  const isProtected = protectedRoutes.some((pattern) => {
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return pathname === base || pathname.startsWith(`${base}/`);
    }
    return pathname === pattern || pathname.startsWith(`${pattern}/`);
  });

  // Not a protected route — allow
  if (!isProtected) return response;

  // Unauthenticated — redirect to login
  if (!claims) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_UNAUTH_REDIRECT;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Fetch profile for role check
  try {
    const userId = claims.sub as string;
    const result = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    const profile = result[0];

    if (!profile || profile.role === "pending") {
      // Pending users can only access /pending
      if (pathname !== "/pending") {
        const url = request.nextUrl.clone();
        url.pathname = DEFAULT_PENDING_REDIRECT;
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Admin route check — only teacher, branch_admin, super_admin
    const isAdminRoute =
      pathname === "/admin" ||
      pathname.startsWith("/admin/");
    const adminRoles = ["teacher", "branch_admin", "super_admin"];

    if (isAdminRoute && !adminRoles.includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Approved users trying to access /pending — redirect to dashboard
    if (pathname === "/pending") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Middleware role check failed:", error);
    // On error, allow request to proceed (fail-open for middleware, guards handle API)
  }

  return response;
}
