import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { branches } from "../branches/branches.schema";

export const schools = pgTable("schools", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  branchId: uuid("branch_id")
    .references(() => branches.id)
    .notNull(),
});
