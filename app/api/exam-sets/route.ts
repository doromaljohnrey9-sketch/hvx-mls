import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { examSets, schools } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";
import { HttpStatus } from "@/constants/http-status.constant";
import { eq, and, like, or } from "drizzle-orm";

import type { ExamSetStatus } from "@/types/drizzle.types";

/**
 * GET /api/exam-sets
 * List exam sets with pagination and filtering.
 *
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - search: string (search by title, subject, or school name)
 * - status: ExamSetStatus (filter by status)
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") as ExamSetStatus | null;
    const conditions = [];

    // Status filter
    if (statusFilter) {
      conditions.push(eq(examSets.status, statusFilter));
    }

    // Search by title, subject, or school name
    if (search) {
      conditions.push(
        or(
          like(examSets.title, `%${search}%`),
          like(examSets.subject, `%${search}%`),
          like(schools.name, `%${search}%`)
        )
      );
    }

    // Build the query
    let countQuery = db
      .select()
      .from(examSets)
      .innerJoin(schools, eq(examSets.schoolId, schools.id));

    let dataQuery = db
      .select({
        id: examSets.id,
        schoolId: examSets.schoolId,
        year: examSets.year,
        semester: examSets.semester,
        examType: examSets.examType,
        grade: examSets.grade,
        subject: examSets.subject,
        title: examSets.title,
        status: examSets.status,
        createdBy: examSets.createdBy,
        createdAt: examSets.createdAt,
        updatedAt: examSets.updatedAt,
        schoolName: schools.name,
      })
      .from(examSets)
      .innerJoin(schools, eq(examSets.schoolId, schools.id));

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
    const examSetsList = await dataQuery.limit(pageSize).offset(offset);

    const response = {
      data: examSetsList,
      total,
    };

    return apiResponse({
      data: response,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching exam sets:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch exam sets",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { user, error: authError } = await requireRole(["super_admin", "teacher"]);
    if (authError) return authError;

    const body = await request.json();
    const { schoolId, year, semester, examType, grade, subject, title } = body;

    if (!schoolId || !year || !semester || !examType || !grade || !subject || !title) {
      return apiResponse({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message:
          "Missing required fields: schoolId, year, semester, examType, grade, subject, title",
      });
    }

    const newExamSet = await db
      .insert(examSets)
      .values({
        schoolId,
        year,
        semester,
        examType,
        grade,
        subject,
        title,
        status: "draft",
        createdBy: user!.id,
      })
      .returning();

    return apiResponse({
      data: newExamSet[0],
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    console.error("Error creating exam set:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create exam set",
    });
  }
}
