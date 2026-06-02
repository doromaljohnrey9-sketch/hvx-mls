import { eq, and, like, or } from "drizzle-orm";
import { NextRequest } from "next/server";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";

import { HttpStatus } from "@/constants/http-status.constant";

import type { UserRole } from "@/types/drizzle.types";
import type { AdminUsersResponse } from "@/types/admin.types";

const ADMIN_ROLES: UserRole[] = ["teacher", "branch_admin", "super_admin"];

/**
 * GET /api/admin/students
 * List students with pagination and filtering. Teacher+ only.
 * Branch Admin: scoped to own branch. Super Admin: all branches.
 *
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - search: string (search by name or email)
 * - role: UserRole (filter by role)
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") as UserRole | null;
    const conditions = [];

    // Branch-scoped access for non-super admins
    if (profile!.role !== "super_admin" && profile!.branchId) {
      conditions.push(eq(profiles.branchId, profile!.branchId));
    }

    // Role filter
    if (roleFilter) {
      conditions.push(eq(profiles.role, roleFilter));
    }

    // Search by name or email
    if (search) {
      conditions.push(or(like(profiles.name, `%${search}%`), like(profiles.email, `%${search}%`)));
    }

    // Build the query
    let countQuery = db.select().from(profiles);
    let dataQuery = db.select().from(profiles);

    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      countQuery = countQuery.where(whereCondition) as typeof countQuery;
      dataQuery = dataQuery.where(whereCondition) as typeof dataQuery;
    }

    // Get total count
    const countResult = await countQuery;
    const total = countResult.length;

    // Get paginated data
    const offset = (page - 1) * pageSize;
    const students = await dataQuery.limit(pageSize).offset(offset);

    const response: AdminUsersResponse = {
      users: students,
      total,
    };

    return apiResponse({
      data: response,
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
 * Body: { userId: string, role?: UserRole }
 */
export async function PATCH(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const body = await request.json();
    const { userId, role } = body as {
      userId: string;
      role?: UserRole;
    };

    if (!userId) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "userId is required.",
      });
    }

    if (!role) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "Role is required.",
      });
    }

    const allowedRoles = ["pending", "student", "teacher", "branch_admin", "super_admin"];
    if (!allowedRoles.includes(role)) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "Invalid role.",
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

    // Update the user role
    await db.update(profiles).set({ role }).where(eq(profiles.id, userId));

    return apiResponse({
      data: { userId, role },
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while updating the student.",
    });
  }
}
