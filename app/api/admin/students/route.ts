import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";

import { HttpStatus } from "@/constants/http-status.constant";

import type { UserRole } from "@/types/drizzle.types";

const ADMIN_ROLES: UserRole[] = ["teacher", "branch_admin", "super_admin"];

/**
 * GET /api/admin/students
 * List students. Teacher+ only.
 * Branch Admin: scoped to own branch. Super Admin: all branches.
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const roleFilter = searchParams.get("role") as UserRole | null;

    let query = db.select().from(profiles);

    // Branch-scoped access for non-super admins
    if (profile!.role !== "super_admin" && profile!.branchId) {
      if (roleFilter) {
        query = query.where(
          and(eq(profiles.branchId, profile!.branchId), eq(profiles.role, roleFilter))
        ) as typeof query;
      } else {
        query = query.where(eq(profiles.branchId, profile!.branchId)) as typeof query;
      }
    } else if (roleFilter) {
      query = query.where(eq(profiles.role, roleFilter)) as typeof query;
    }

    const students = await query;

    return apiResponse({
      data: students,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching the student list.",
    });
  }
}

/**
 * PATCH /api/admin/students
 * Update a student's role. Teacher+ only.
 * Body: { userId: string, role: "student" | "pending" | "blocked" }
 */
export async function PATCH(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const body = await request.json();
    const { userId, role } = body as { userId: string; role: string };

    if (!userId || !role) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "userId and role are required.",
      });
    }

    const allowedRoles = ["pending", "student", "blocked"];
    if (!allowedRoles.includes(role)) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "Invalid role.",
      });
    }

    // Fetch target user
    const targetResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);
    const targetUser = targetResult[0];

    if (!targetUser) {
      return apiResponse({
        status: HttpStatus.NOT_FOUND,
        message: "User not found.",
      });
    }

    // Branch Admin can only manage users in their own branch
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

    // Update the user's role
    await db
      .update(profiles)
      .set({ role: role as UserRole })
      .where(eq(profiles.id, userId));

    return apiResponse({
      data: { userId, role },
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error updating student role:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while updating the student role.",
    });
  }
}
