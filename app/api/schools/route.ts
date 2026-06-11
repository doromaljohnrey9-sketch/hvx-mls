import { db } from "@/lib/drizzle/db";
import { schools } from "@/drizzle/schemas";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { HttpStatus } from "@/constants/http-status.constant";
import { NextRequest } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { name, branchId } = body;

    if (!name || !branchId) {
      return apiResponse({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: "Name and branchId are required",
      });
    }

    const [newSchool] = await db
      .insert(schools)
      .values({
        name,
        branchId,
      })
      .returning();

    return apiResponse({
      data: newSchool,
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    console.error("Failed to create school:", error);
    return apiResponse({
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create school",
    });
  }
}
