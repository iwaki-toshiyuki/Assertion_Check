CREATE TABLE "analysis_usage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"usage_date" date NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_usage_user_date_unique" UNIQUE("user_id","usage_date")
);
--> statement-breakpoint
ALTER TABLE "analysis_usage" ADD CONSTRAINT "analysis_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;