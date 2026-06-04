ALTER TYPE "public"."user_role" ADD VALUE 'denied' BEFORE 'student';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'blocked' BEFORE 'student';