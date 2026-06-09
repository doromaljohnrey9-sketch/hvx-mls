CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'essay');--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "question_type" "question_type" DEFAULT 'multiple_choice' NOT NULL;--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "part" integer DEFAULT 1 NOT NULL;