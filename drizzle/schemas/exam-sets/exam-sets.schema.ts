import { pgTable, varchar, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { schools } from "../schools/schools.schema";

export const examSetStatusEnum = pgEnum("exam_set_status", ["none", "partial", "complete"]);

export const examSets = pgTable("exam_sets", {
  ...baseColumns,
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  year: integer("year").notNull(),
  semester: integer("semester").notNull(), // 1 or 2
  examType: varchar("exam_type", { length: 50 }).notNull(), // Midterm, Final
  grade: integer("grade").notNull(), // 1, 2, 3
  subject: varchar("subject", { length: 100 }).notNull(),
  status: examSetStatusEnum("status").default("none").notNull(),
});
