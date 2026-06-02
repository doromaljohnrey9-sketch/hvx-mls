CREATE TYPE "public"."exam_set_status" AS ENUM('none', 'partial', 'complete');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('pending', 'student', 'teacher', 'branch_admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."video_visibility" AS ENUM('public', 'private', 'hidden');--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"school_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"semester" integer NOT NULL,
	"exam_type" varchar(50) NOT NULL,
	"grade" integer NOT NULL,
	"subject" varchar(100) NOT NULL,
	"status" "exam_set_status" DEFAULT 'none' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"exam_set_id" uuid NOT NULL,
	"problem_number" integer NOT NULL,
	"video_url" text NOT NULL,
	"title" varchar(255),
	"visibility" "video_visibility" DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"name" varchar(255) NOT NULL,
	"branch_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "role" "user_role" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
ALTER TABLE "exam_sets" ADD CONSTRAINT "exam_sets_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_videos" ADD CONSTRAINT "problem_videos_exam_set_id_exam_sets_id_fk" FOREIGN KEY ("exam_set_id") REFERENCES "public"."exam_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;