import { db } from "@/lib/drizzle/db";
import { schools } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const allSchools = await db.select().from(schools);

    return apiResponse({
      data: allSchools,
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch schools",
    });
  }
}
