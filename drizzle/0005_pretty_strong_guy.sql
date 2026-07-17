CREATE TYPE "public"."upload_kind" AS ENUM('post-image', 'post-video', 'avatar', 'chat-blob');--> statement-breakpoint
CREATE TYPE "public"."upload_status" AS ENUM('pending', 'ready');--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "upload_kind" NOT NULL,
	"key" text NOT NULL,
	"sha256" text NOT NULL,
	"content_length" integer NOT NULL,
	"status" "upload_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;