import * as schema from "@/drizzle/schemas";

// Profile types
export type SelectProfile = typeof schema.profiles.$inferSelect;
export type InsertProfile = typeof schema.profiles.$inferInsert;

// Branch types
export type SelectBranch = typeof schema.branches.$inferSelect;
export type InsertBranch = typeof schema.branches.$inferInsert;

// School types
export type SelectSchool = typeof schema.schools.$inferSelect;
export type InsertSchool = typeof schema.schools.$inferInsert;

// Exam Set types
export type SelectExamSet = typeof schema.examSets.$inferSelect;
export type InsertExamSet = typeof schema.examSets.$inferInsert;

// Problem Video types
export type SelectProblemVideo = typeof schema.problemVideos.$inferSelect;
export type InsertProblemVideo = typeof schema.problemVideos.$inferInsert;

// Role type derived from the enum
export type UserRole = SelectProfile["role"];

// Approval status type derived from the enum
export type ApprovalStatus = SelectProfile["approvalStatus"];

// Branch status type derived from the enum
export type BranchStatus = SelectBranch["status"];

// School type derived from the enum
export type SchoolType = SelectSchool["schoolType"];

// Exam set types derived from enums
export type Semester = SelectExamSet["semester"];
export type ExamType = SelectExamSet["examType"];
export type ExamSetStatus = SelectExamSet["status"];

// Video types derived from enums
export type VideoVisibility = SelectProblemVideo["visibility"];
export type VideoUploadStatus = SelectProblemVideo["uploadStatus"];
