CREATE TABLE "visitor_preferences" (
	"id" uuid PRIMARY KEY,
	"locale" text DEFAULT 'en' NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"reduced_motion" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
