ALTER TABLE "analysis_usage" DROP CONSTRAINT "analysis_usage_user_date_unique";--> statement-breakpoint
CREATE INDEX "analysis_usage_user_created_at_idx" ON "analysis_usage" USING btree ("user_id","created_at");--> statement-breakpoint
ALTER TABLE "analysis_usage" DROP COLUMN "usage_date";--> statement-breakpoint
ALTER TABLE "analysis_usage" DROP COLUMN "request_count";--> statement-breakpoint
ALTER TABLE "analysis_usage" DROP COLUMN "updated_at";