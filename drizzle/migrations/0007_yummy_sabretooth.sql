CREATE TYPE "public"."branch_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."school_type" AS ENUM('high_school', 'middle_school', 'elementary');--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "region_name" varchar(100);--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "status" "branch_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "school_type" "school_type" DEFAULT 'high_school' NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "region" varchar(100);