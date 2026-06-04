import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { problemVideos, examSets, schools } from "@/drizzle/schemas";
import { eq, and, like, or, sql } from "drizzle-orm";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { HttpStatus } from "@/constants/http-status.constant";

import type { Video } from "@/types/video.types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || undefined;
    const schoolId = searchParams.get("schoolId") || undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;
    const semester = searchParams.get("semester") as "1st" | "2nd" | undefined;
    const examType = searchParams.get("examType") as "midterm" | "final" | undefined;
    const grade = searchParams.get("grade") ? parseInt(searchParams.get("grade")!, 10) : undefined;
    const subject = searchParams.get("subject") || undefined;
    const problemNumber = searchParams.get("problemNumber")
      ? parseInt(searchParams.get("problemNumber")!, 10)
      : undefined;

    const conditions = [];

    if (schoolId) {
      conditions.push(eq(examSets.schoolId, schoolId));
    }
    if (year) {
      conditions.push(eq(examSets.year, year));
    }
    if (semester) {
      conditions.push(eq(examSets.semester, semester));
    }
    if (examType) {
      conditions.push(eq(examSets.examType, examType));
    }
    if (grade) {
      conditions.push(eq(examSets.grade, grade));
    }
    if (subject) {
      conditions.push(like(examSets.subject, `%${subject}%`));
    }
    if (problemNumber) {
      conditions.push(eq(problemVideos.problemNumber, problemNumber));
    }
    if (search) {
      conditions.push(
        or(like(problemVideos.title, `%${search}%`), like(schools.name, `%${search}%`))
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        id: problemVideos.id,
        examSetId: problemVideos.examSetId,
        problemNumber: problemVideos.problemNumber,
        videoUrl: problemVideos.videoUrl,
        title: problemVideos.title,
        visibility: problemVideos.visibility,
        createdAt: problemVideos.createdAt,
        updatedAt: problemVideos.updatedAt,
        examSetId_2: examSets.id,
        schoolId: examSets.schoolId,
        year: examSets.year,
        semester: examSets.semester,
        examType: examSets.examType,
        grade: examSets.grade,
        subject: examSets.subject,
        title_2: examSets.title,
        status: examSets.status,
        schoolId_2: schools.id,
        schoolName: schools.name,
        schoolBranchId: schools.branchId,
      })
      .from(problemVideos)
      .innerJoin(examSets, eq(problemVideos.examSetId, examSets.id))
      .innerJoin(schools, eq(examSets.schoolId, schools.id))
      .where(whereClause)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(problemVideos)
      .innerJoin(examSets, eq(problemVideos.examSetId, examSets.id))
      .innerJoin(schools, eq(examSets.schoolId, schools.id))
      .where(whereClause);

    const total = totalCountResult[0]?.count || 0;

    // Map results to the expected Video type
    const videos: Video[] = results.map((row) => ({
      id: row.id,
      examSetId: row.examSetId,
      problemNumber: row.problemNumber,
      videoUrl: row.videoUrl,
      title: row.title,
      visibility: row.visibility as "public" | "private" | "hidden",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      examSet: {
        id: row.examSetId_2,
        schoolId: row.schoolId,
        year: row.year,
        semester: row.semester as "1st" | "2nd",
        examType: row.examType as "midterm" | "final",
        grade: row.grade,
        subject: row.subject,
        title: row.title_2,
        status: row.status as "draft" | "published" | "hidden",
        school: {
          id: row.schoolId_2,
          name: row.schoolName,
          branchId: row.schoolBranchId,
        },
      },
    }));

    return apiResponse({
      data: {
        videos,
        total,
      },
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch videos",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { examSetId, problemNumber, videoUrl, title, visibility } = body;

    if (!examSetId || !problemNumber || !videoUrl) {
      return apiResponse({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: "Missing required fields: examSetId, problemNumber, videoUrl",
      });
    }

    // Check for duplicate problem number in the same exam set
    const existingVideo = await db
      .select()
      .from(problemVideos)
      .where(
        and(eq(problemVideos.examSetId, examSetId), eq(problemVideos.problemNumber, problemNumber))
      )
      .limit(1);

    if (existingVideo.length > 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.CONFLICT,
        message: "A video with this problem number already exists in this exam set",
      });
    }

    const newVideo = await db
      .insert(problemVideos)
      .values({
        examSetId,
        problemNumber,
        videoUrl,
        title: title || null,
        visibility: visibility || "public",
      })
      .returning();

    return apiResponse({
      data: newVideo[0],
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create video",
    });
  }
}
