import { db } from "@/lib/drizzle/db";
import { examSets } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const subjects = await db
      .selectDistinct({ subject: examSets.subject })
      .from(examSets)
      .orderBy(examSets.subject);

    const subjectList = subjects.map((s) => s.subject);

    return apiResponse({
      data: subjectList,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch subjects",
    });
  }
}
