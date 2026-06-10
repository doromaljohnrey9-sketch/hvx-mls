import { pgTable, varchar, pgEnum, uuid, timestamp, integer } from "drizzle-orm/pg-core";

// Base columns
import { baseColumns } from "../base";
import { branches } from "../branches/branches.schema";
import { schools } from "../schools/schools.schema";

export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "super_admin"]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
  "blocked",
]);

export const profiles = pgTable("profiles", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: userRoleEnum("role").default("student").notNull(),
  branchId: uuid("branch_id").references(() => branches.id),
  schoolId: uuid("school_id").references(() => schools.id),
  grade: integer("grade"),
  assignedTeacher: varchar("assigned_teacher", { length: 100 }),
  approvalStatus: approvalStatusEnum("approval_status").default("pending").notNull(),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
});
