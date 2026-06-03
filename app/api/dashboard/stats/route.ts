import { count, eq, gte } from "drizzle-orm";

import { profiles } from "@/drizzle/schemas";
import { examSets } from "@/drizzle/schemas";
import { problemVideos } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { apiResponse } from "@/lib/response";
import { rateLimit } from "@/lib/ratelimit";
import { requireAuth } from "@/lib/guards/auth.guard";

import { HttpStatus } from "@/constants/http-status.constant";

export async function GET() {
  try {
    const rateLimited = await rateLimit("api");
    if (rateLimited) return rateLimited;

    const { error } = await requireAuth();
    if (error) return error;

    // Get total counts
    const [usersCount] = await db.select({ count: count() }).from(profiles);
    const [examSetsCount] = await db.select({ count: count() }).from(examSets);
    const [videosCount] = await db.select({ count: count() }).from(problemVideos);

    // Get users created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const [usersThisWeekCount] = await db
      .select({ count: count() })
      .from(profiles)
      .where(gte(profiles.createdAt, sevenDaysAgo));

    // Get published exam sets (status = "complete")
    const [publishedExamSetsCount] = await db
      .select({ count: count() })
      .from(examSets)
      .where(eq(examSets.status, "complete"));

    // Get users by role
    const usersByRole = await db
      .select({
        role: profiles.role,
        count: count(),
      })
      .from(profiles)
      .groupBy(profiles.role);

    // Get exam sets by status
    const examSetsByStatus = await db
      .select({
        status: examSets.status,
        count: count(),
      })
      .from(examSets)
      .groupBy(examSets.status);

    return apiResponse({
      data: {
        totalUsers: usersCount?.count ?? 0,
        totalExamSets: examSetsCount?.count ?? 0,
        totalVideos: videosCount?.count ?? 0,
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: item.count,
        })),
        examSetsByStatus: examSetsByStatus.map((item) => ({
          status: item.status,
          count: item.count,
        })),
        usersThisWeek: usersThisWeekCount?.count ?? 0,
        publishedExamSets: publishedExamSetsCount?.count ?? 0,
      },
      status: HttpStatus.OK,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return apiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch dashboard stats",
    });
  }
}
