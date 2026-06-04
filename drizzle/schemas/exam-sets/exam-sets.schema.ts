import { pgTable, varchar, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { schools } from "../schools/schools.schema";
import { profiles } from "../profiles/profiles.schema";

export const semesterEnum = pgEnum("semester", ["1st", "2nd"]);

export const examTypeEnum = pgEnum("exam_type", ["midterm", "final"]);

export const examSetStatusEnum = pgEnum("exam_set_status", ["draft", "published", "hidden"]);

export const examSets = pgTable("exam_sets", {
  ...baseColumns,
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  year: integer("year").notNull(),
  semester: semesterEnum("semester").notNull(),
  examType: examTypeEnum("exam_type").notNull(),
  grade: integer("grade").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  status: examSetStatusEnum("status").default("draft").notNull(),
  createdBy: uuid("created_by").references(() => profiles.id),
});
