import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";

import { HttpStatus } from "@/constants/http-status.constant";

import type { UserRole } from "@/types/drizzle.types";

const ADMIN_ROLES: UserRole[] = ["teacher", "super_admin"];

/**
 * POST /api/admin/users/reset-password
 * Reset a user's password. Teacher+ only.
 * Body: { userId: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const body = await request.json();
    const { userId, password } = body as { userId: string; password: string };

    if (!userId || !password) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "userId and password are required.",
      });
    }

    if (password.length < 6) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Fetch target user
    const targetResult = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    const targetUser = targetResult[0];

    if (!targetUser) {
      return apiResponse({
        status: HttpStatus.NOT_FOUND,
        message: "User not found.",
      });
    }

    // Users cannot reset their own password through this endpoint
    if (profile!.id === userId) {
      return apiResponse({
        status: HttpStatus.FORBIDDEN,
        message: "Cannot reset your own password through this endpoint.",
      });
    }

    // Teacher can only manage users in their own branch
    if (
      profile!.role !== "super_admin" &&
      profile!.branchId &&
      targetUser.branchId !== profile!.branchId
    ) {
      return apiResponse({
        status: HttpStatus.FORBIDDEN,
        message: "Cannot manage users from other branches.",
      });
    }

    // Update password in Supabase auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables for admin operations");
      return apiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Server configuration error: Missing Supabase service role key.",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Attempting to update password for user ID:", userId);
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      console.error("Error updating user password:", updateError);
      return apiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: updateError.message || "Failed to update password.",
      });
    }

    console.log("Password updated successfully for user ID:", userId);

    return apiResponse({
      data: { userId },
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while resetting the password.",
    });
  }
}
