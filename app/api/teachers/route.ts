import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";

import { HttpStatus } from "@/constants/http-status.constant";
import type { Teacher } from "@/types/teacher.types";

/**
 * GET /api/teachers
 * List all teachers (public endpoint for registration form)
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const searchParams = request.nextUrl.searchParams;
    const branchId = searchParams.get("branchId");
    const schoolId = searchParams.get("schoolId");

    const conditions = [eq(profiles.role, "teacher")];

    if (branchId) {
      conditions.push(eq(profiles.branchId, branchId));
    }

    if (schoolId) {
      conditions.push(eq(profiles.schoolId, schoolId));
    }

    const teachers = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        email: profiles.email,
        branchId: profiles.branchId,
        schoolId: profiles.schoolId,
      })
      .from(profiles)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

    return apiResponse({
      data: teachers,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching teachers.",
    });
  }
}
