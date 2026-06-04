CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected', 'blocked');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'student'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher', 'branch_admin', 'super_admin');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'student'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "school_id" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "approval_status" "approval_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "image_url";