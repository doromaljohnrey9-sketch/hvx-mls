import { type NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { PROTECTED_ROUTE_PATTERNS } from "@/constants/routes.constant";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Skip next-intl for API routes to avoid 404s/rewrites
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return await updateSession(request, PROTECTED_ROUTE_PATTERNS);
  }

  const response = intlMiddleware(request);
  return await updateSession(request, PROTECTED_ROUTE_PATTERNS, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (all api routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
