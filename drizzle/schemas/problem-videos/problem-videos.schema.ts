import { pgTable, varchar, uuid, integer, pgEnum, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { examSets } from "../exam-sets/exam-sets.schema";
import { profiles } from "../profiles/profiles.schema";

export const videoVisibilityEnum = pgEnum("video_visibility", ["public", "private", "hidden"]);

export const videoUploadStatusEnum = pgEnum("video_upload_status", [
  "pending",
  "completed",
  "failed",
]);

export const questionTypeEnum = pgEnum("question_type", ["multiple_choice", "essay"]);

export const problemVideos = pgTable("problem_videos", {
  ...baseColumns,
  examSetId: uuid("exam_set_id")
    .references(() => examSets.id)
    .notNull(),
  problemNumber: integer("problem_number").notNull(),
  questionType: questionTypeEnum("question_type").default("multiple_choice").notNull(),
  part: integer("part").default(1).notNull(),
  videoUrl: text("video_url").notNull(),
  filePath: varchar("file_path", { length: 500 }),
  duration: integer("duration"),
  title: varchar("title", { length: 255 }),
  visibility: videoVisibilityEnum("visibility").default("public").notNull(),
  uploadStatus: videoUploadStatusEnum("upload_status").default("completed").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => profiles.id),
});
