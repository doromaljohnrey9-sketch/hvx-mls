import { pgTable, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { branches } from "../branches/branches.schema";

export const schoolTypeEnum = pgEnum("school_type", ["high_school", "middle_school", "elementary"]);

export const schools = pgTable("schools", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  branchId: uuid("branch_id")
    .references(() => branches.id)
    .notNull(),
  schoolType: schoolTypeEnum("school_type").default("high_school").notNull(),
  region: varchar("region", { length: 100 }),
});
