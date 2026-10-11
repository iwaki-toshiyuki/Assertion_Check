CREATE TABLE "analysis_results" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"record_id" bigint NOT NULL,
	"assertive_score" integer NOT NULL,
	"aggressive_score" integer NOT NULL,
	"non_assertive_score" integer NOT NULL,
	"feedback" text NOT NULL,
	"improvement" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_results_record_id_unique" UNIQUE("record_id")
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"situation" varchar(500) NOT NULL,
	"response" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cognito_sub" varchar(255) NOT NULL,
	"username" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_cognito_sub_unique" UNIQUE("cognito_sub")
);
--> statement-breakpoint
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_record_id_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;