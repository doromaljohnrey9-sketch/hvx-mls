import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { problemVideos, examSets, schools } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireRole } from "@/lib/guards/role.guard";
import { HttpStatus } from "@/constants/http-status.constant";

import type { Video } from "@/types/video.types";
import type { InsertProblemVideo } from "@/types/drizzle.types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { id } = await params;

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
      .where(eq(problemVideos.id, id))
      .limit(1);

    if (results.length === 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.NOT_FOUND,
        message: "Video not found",
      });
    }

    const row = results[0];

    const video: Video = {
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
    };

    return apiResponse({
      data: video,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch video",
    });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { user, error: authError } = await requireRole([
      "super_admin",
      "branch_admin",
      "teacher",
    ]);
    if (authError) return authError;

    const { id } = await params;
    const body = (await request.json()) as Partial<InsertProblemVideo>;

    const updatedVideo = await db
      .update(problemVideos)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(problemVideos.id, id))
      .returning();

    if (updatedVideo.length === 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.NOT_FOUND,
        message: "Video not found",
      });
    }

    return apiResponse({
      data: updatedVideo[0],
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update video",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { user, error: authError } = await requireRole([
      "super_admin",
      "branch_admin",
      "teacher",
    ]);
    if (authError) return authError;

    const { id } = await params;

    const deletedVideo = await db.delete(problemVideos).where(eq(problemVideos.id, id)).returning();

    if (deletedVideo.length === 0) {
      return apiResponse({
        data: null,
        status: HttpStatus.NOT_FOUND,
        message: "Video not found",
      });
    }

    return apiResponse({
      data: deletedVideo[0],
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete video",
    });
  }
}
