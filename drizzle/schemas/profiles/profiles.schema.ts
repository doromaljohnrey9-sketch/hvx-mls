import { pgTable, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";

// Base columns
import { baseColumns } from "../base";
import { branches } from "../branches/branches.schema";

export const userRoleEnum = pgEnum("user_role", [
  "pending",
  "student",
  "teacher",
  "branch_admin",
  "super_admin",
]);

export const profiles = pgTable("profiles", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  role: userRoleEnum("role").default("pending").notNull(),
  branchId: uuid("branch_id").references(() => branches.id),
});
