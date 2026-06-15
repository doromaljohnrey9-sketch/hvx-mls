import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";

import { HttpStatus } from "@/constants/http-status.constant";

import type { UserRole, ApprovalStatus } from "@/types/drizzle.types";

const ADMIN_ROLES: UserRole[] = ["teacher", "super_admin"];

/**
 * PATCH /api/admin/users/[id]
 * Update a user's profile. Teacher+ only.
 *
 * Body: { name?: string, role?: UserRole, approvalStatus?: ApprovalStatus, branchId?: string | null, schoolId?: string | null, grade?: number | null, assignedTeacher?: string | null }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { profile, error } = await requireRole(ADMIN_ROLES);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, role, approvalStatus, branchId, schoolId, grade, assignedTeacher } = body as {
      name?: string;
      role?: UserRole;
      approvalStatus?: ApprovalStatus;
      branchId?: string | null;
      schoolId?: string | null;
      grade?: number | null;
      assignedTeacher?: string | null;
    };

    if (
      !name &&
      !role &&
      !approvalStatus &&
      branchId === undefined &&
      schoolId === undefined &&
      grade === undefined &&
      assignedTeacher === undefined
    ) {
      return apiResponse({
        status: HttpStatus.BAD_REQUEST,
        message: "At least one field to update is required.",
      });
    }

    // Validate role if provided
    if (role) {
      const allowedRoles = ["student", "teacher", "super_admin"];
      if (!allowedRoles.includes(role)) {
        return apiResponse({
          status: HttpStatus.BAD_REQUEST,
          message: "Invalid role.",
        });
      }
    }

    // Validate approvalStatus if provided
    if (approvalStatus) {
      const allowedStatuses = ["pending", "approved", "rejected", "blocked"];
      if (!allowedStatuses.includes(approvalStatus)) {
        return apiResponse({
          status: HttpStatus.BAD_REQUEST,
          message: "Invalid approval status.",
        });
      }
    }

    // Fetch target user
    const targetResult = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    const targetUser = targetResult[0];

    if (!targetUser) {
      return apiResponse({
        status: HttpStatus.NOT_FOUND,
        message: "User not found.",
      });
    }

    // Users cannot modify themselves (except super admins)
    if (profile!.id === id && profile!.role !== "super_admin") {
      return apiResponse({
        status: HttpStatus.FORBIDDEN,
        message: "Cannot modify your own account.",
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

    // Build update object
    const updateData: Partial<typeof profiles.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (approvalStatus !== undefined) {
      updateData.approvalStatus = approvalStatus;
      updateData.approvedBy = profile!.id;
      updateData.approvedAt = new Date();
    }
    if (branchId !== undefined) updateData.branchId = branchId;
    if (schoolId !== undefined) updateData.schoolId = schoolId;
    if (grade !== undefined) updateData.grade = grade;
    if (assignedTeacher !== undefined) updateData.assignedTeacher = assignedTeacher;

    const updatedUser = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, id))
      .returning();

    return apiResponse({
      data: updatedUser[0],
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while updating the user.",
    });
  }
}
