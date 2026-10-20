ALTER TABLE "analysis_usage"
ALTER COLUMN "created_at"
SET DATA TYPE timestamp with time zone
USING "created_at" AT TIME ZONE 'UTC';--> statement-breakpoint

ALTER TABLE "analysis_usage"
ALTER COLUMN "created_at"
SET DEFAULT now();