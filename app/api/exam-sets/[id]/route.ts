import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { examSets } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";
import { HttpStatus } from "@/constants/http-status.constant";
import { eq } from "drizzle-orm";

import type { InsertExamSet } from "@/types/drizzle.types";

/**
 * PATCH /api/exam-sets/[id]
 * Update an exam set by ID.
 *
 * Body: { schoolId?, year?, semester?, examType?, grade?, subject?, title?, status? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { user, error: authError } = await requireRole(["super_admin", "teacher"]);
    if (authError) return authError;

    const { id } = await params;
    const body = (await request.json()) as Partial<InsertExamSet>;

    const updatedExamSet = await db
      .update(examSets)
      .set(body)
      .where(eq(examSets.id, id))
      .returning();

    if (updatedExamSet.length === 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.NOT_FOUND,
        message: "Exam set not found",
      });
    }

    return apiResponse({
      data: updatedExamSet[0],
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error updating exam set:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update exam set",
    });
  }
}

/**
 * DELETE /api/exam-sets/[id]
 * Delete an exam set by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { user, error: authError } = await requireRole(["super_admin", "teacher"]);
    if (authError) return authError;

    const { id } = await params;

    const deletedExamSet = await db
      .delete(examSets)
      .where(eq(examSets.id, id))
      .returning();

    if (deletedExamSet.length === 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.NOT_FOUND,
        message: "Exam set not found",
      });
    }

    return apiResponse({
      data: deletedExamSet[0],
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error deleting exam set:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete exam set",
    });
  }
}
