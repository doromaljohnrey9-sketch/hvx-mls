CREATE TYPE "public"."exam_type" AS ENUM('midterm', 'final');--> statement-breakpoint
CREATE TYPE "public"."semester" AS ENUM('1st', '2nd');--> statement-breakpoint
DROP TABLE IF EXISTS "exam_sets" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."exam_set_status";--> statement-breakpoint
CREATE TYPE "public"."exam_set_status" AS ENUM('draft', 'published', 'hidden');--> statement-breakpoint
CREATE TABLE "exam_sets" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "deleted_at" timestamp,
    "school_id" uuid NOT NULL,
    "year" integer NOT NULL,
    "semester" "public"."semester" NOT NULL,
    "exam_type" "public"."exam_type" NOT NULL,
    "grade" integer NOT NULL,
    "subject" varchar(100) NOT NULL,
    "title" varchar(255) NOT NULL,
    "status" "public"."exam_set_status" DEFAULT 'draft'::"public"."exam_set_status" NOT NULL,
    "created_by" uuid,
    CONSTRAINT "exam_sets_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON UPDATE no action ON DELETE no action,
    CONSTRAINT "exam_sets_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON UPDATE no action ON DELETE no action
);