import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { examSets, schools } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { getSupabaseServer } from "@/lib/supabase/server";
import { HttpStatus } from "@/constants/http-status.constant";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const supabase = await getSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiResponse({
        data: null,
        status: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }

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
        createdBy: user.id,
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

export async function GET(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const examSetsList = await db
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

    return apiResponse({
      data: examSetsList,
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
