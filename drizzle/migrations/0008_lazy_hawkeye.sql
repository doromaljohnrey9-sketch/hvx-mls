CREATE TYPE "public"."video_upload_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "file_path" varchar(500);--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "upload_status" "video_upload_status" DEFAULT 'completed' NOT NULL;--> statement-breakpoint
ALTER TABLE "problem_videos" ADD COLUMN "uploaded_by" uuid;--> statement-breakpoint
ALTER TABLE "problem_videos" ADD CONSTRAINT "problem_videos_uploaded_by_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;