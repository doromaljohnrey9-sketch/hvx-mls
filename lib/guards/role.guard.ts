import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

import { apiResponse } from "@/lib/response";
import { getSupabaseServer } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";

import { HttpStatus } from "@/constants/http-status.constant";

import type { SelectProfile, UserRole } from "@/types/drizzle.types";

/**
 * Requires authentication AND checks user role against allowed roles.
 * Returns user, profile, and optional error response.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<{
  user: User | null;
  profile: SelectProfile | null;
  error: NextResponse | null;
}> {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        user: null,
        profile: null,
        error: apiResponse({
          status: HttpStatus.UNAUTHORIZED,
          message: authError?.message ?? "Unauthorized",
        }),
      };
    }

    const result = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
    const profile = result[0] ?? null;

    if (!profile) {
      return {
        user,
        profile: null,
        error: apiResponse({
          status: HttpStatus.FORBIDDEN,
          message: "Profile not found.",
        }),
      };
    }

    if (!allowedRoles.includes(profile.role)) {
      return {
        user,
        profile,
        error: apiResponse({
          status: HttpStatus.FORBIDDEN,
          message: "Access denied.",
        }),
      };
    }

    return { user, profile, error: null };
  } catch (error) {
    console.error("Role verification failed:", error);
    return {
      user: null,
      profile: null,
      error: apiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error verifying permissions.",
      }),
    };
  }
}
