import { pgTable, varchar, pgEnum } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

export const branchStatusEnum = pgEnum("branch_status", ["active", "inactive"]);

export const branches = pgTable("branches", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  regionName: varchar("region_name", { length: 100 }),
  status: branchStatusEnum("status").default("active").notNull(),
});
