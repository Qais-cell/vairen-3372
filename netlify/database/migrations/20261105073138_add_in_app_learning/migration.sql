CREATE TABLE "learning_courses" (
	"id" text PRIMARY KEY,
	"title" jsonb NOT NULL,
	"summary" jsonb NOT NULL,
	"category" text NOT NULL,
	"level" text NOT NULL,
	"profession_ids" jsonb NOT NULL,
	"provider" text NOT NULL,
	"source_title" text NOT NULL,
	"source_url" text NOT NULL,
	"video_id" text NOT NULL,
	"image_path" text NOT NULL,
	"visual_prompt" jsonb NOT NULL,
	"prerequisites" jsonb NOT NULL,
	"outcomes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_lessons" (
	"id" text PRIMARY KEY,
	"course_id" text NOT NULL,
	"position" integer NOT NULL,
	"kind" text NOT NULL,
	"title" jsonb NOT NULL,
	"content" jsonb NOT NULL,
	CONSTRAINT "learning_lesson_position" UNIQUE("course_id","position")
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"visitor_id" uuid,
	"lesson_id" text,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "learning_progress_pkey" PRIMARY KEY("visitor_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "learning_lessons" ADD CONSTRAINT "learning_lessons_course_id_learning_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "learning_courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_lesson_id_learning_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "learning_lessons"("id") ON DELETE CASCADE;