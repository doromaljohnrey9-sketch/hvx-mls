"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle/db";
import { profiles } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

import type { AdminUserUpdate } from "@/types/admin.types";

export async function updateAdminUser(userId: string, updates: AdminUserUpdate) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if the authenticated user has admin privileges
    const adminUser = await db.select().from(profiles).where(eq(profiles.id, authUser.id)).limit(1);

    if (!adminUser[0] || !["super_admin", "teacher"].includes(adminUser[0].role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Update the target user
    await db
      .update(profiles)
      .set({
        ...(updates.role && { role: updates.role }),
        ...(updates.approvalStatus && { approvalStatus: updates.approvalStatus }),
        ...(updates.approvalStatus === "approved" && {
          approvedBy: authUser.id,
          approvedAt: new Date(),
        }),
      })
      .where(eq(profiles.id, userId));

    return { success: true, data: null };
  } catch (error) {
    console.error("Error updating admin user:", error);
    return { success: false, error: "Failed to update user" };
  }
}
