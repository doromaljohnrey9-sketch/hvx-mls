import { pgTable, varchar, uuid, integer, pgEnum, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { examSets } from "../exam-sets/exam-sets.schema";

export const videoVisibilityEnum = pgEnum("video_visibility", ["public", "private", "hidden"]);

export const problemVideos = pgTable("problem_videos", {
  ...baseColumns,
  examSetId: uuid("exam_set_id")
    .references(() => examSets.id)
    .notNull(),
  problemNumber: integer("problem_number").notNull(),
  videoUrl: text("video_url").notNull(),
  title: varchar("title", { length: 255 }),
  visibility: videoVisibilityEnum("visibility").default("public").notNull(),
});
