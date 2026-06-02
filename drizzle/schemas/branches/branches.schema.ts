import { pgTable, varchar } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

export const branches = pgTable("branches", {
  ...baseColumns,
  name: varchar("name", { length: 255 }).notNull(),
});
