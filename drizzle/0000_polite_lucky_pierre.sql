CREATE TYPE "public"."attempt_outcome" AS ENUM('solved', 'taught_out', 'skipped', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."input_mode" AS ENUM('tap', 'text', 'voice', 'ink');--> statement-breakpoint
CREATE TYPE "public"."session_source" AS ENUM('picked', 'suggested', 'photo');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('active', 'completed', 'abandoned', 'time_limit');--> statement-breakpoint
CREATE TYPE "public"."subject_code" AS ENUM('math', 'mn');--> statement-breakpoint
CREATE TYPE "public"."turn_role" AS ENUM('manuu', 'child', 'system');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('correct', 'near', 'wrong');--> statement-breakpoint
CREATE TABLE "attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"problem_id" text NOT NULL,
	"order_index" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"outcome" "attempt_outcome",
	"hint_level_used" smallint DEFAULT 0 NOT NULL,
	"wrong_answer_count" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "child_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"grade" smallint NOT NULL,
	"birth_month" smallint,
	"birth_year" smallint,
	"avatar_id" text DEFAULT 'manuu' NOT NULL,
	"ai_friend_name" text DEFAULT 'Мануу' NOT NULL,
	"daily_minute_limit" integer DEFAULT 30 NOT NULL,
	"voice_enabled" boolean DEFAULT true NOT NULL,
	"transcript_visible_to_parent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "daily_activity" (
	"child_id" uuid NOT NULL,
	"day" date NOT NULL,
	"minutes_used" integer DEFAULT 0 NOT NULL,
	"sessions_count" integer DEFAULT 0 NOT NULL,
	"problems_solved" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_activity_child_id_day_pk" PRIMARY KEY("child_id","day")
);
--> statement-breakpoint
CREATE TABLE "parent_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text NOT NULL,
	"email" text,
	"phone" text,
	"locale" text DEFAULT 'mn' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"grade" smallint NOT NULL,
	"prompt_mn" text NOT NULL,
	"display" jsonb NOT NULL,
	"answer_spec" jsonb NOT NULL,
	"solution_steps" jsonb NOT NULL,
	"difficulty" smallint DEFAULT 1 NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"subject_id" text,
	"topic_id" text,
	"source" "session_source" DEFAULT 'picked' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"status" "session_status" DEFAULT 'active' NOT NULL,
	"total_ms" integer DEFAULT 0 NOT NULL,
	"problems_attempted" integer DEFAULT 0 NOT NULL,
	"problems_solved_unaided" integer DEFAULT 0 NOT NULL,
	"cost_micros" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" text PRIMARY KEY NOT NULL,
	"code" "subject_code" NOT NULL,
	"name_mn" text NOT NULL,
	"icon_key" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_id" text NOT NULL,
	"grade" smallint NOT NULL,
	"name_mn" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"requires_topic_id" text
);
--> statement-breakpoint
CREATE TABLE "topic_mastery" (
	"child_id" uuid NOT NULL,
	"topic_id" text NOT NULL,
	"level" smallint DEFAULT 0 NOT NULL,
	"unaided_rate" smallint DEFAULT 0 NOT NULL,
	"attempts_count" integer DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp with time zone,
	CONSTRAINT "topic_mastery_child_id_topic_id_pk" PRIMARY KEY("child_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "turn" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"role" "turn_role" NOT NULL,
	"step_index" smallint NOT NULL,
	"content_mn" text NOT NULL,
	"mode" "input_mode",
	"verdict" "verdict",
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_profile" ADD CONSTRAINT "child_profile_parent_id_parent_account_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_child_id_child_profile_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."child_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_child_id_child_profile_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."child_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic" ADD CONSTRAINT "topic_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_mastery" ADD CONSTRAINT "topic_mastery_child_id_child_profile_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."child_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_mastery" ADD CONSTRAINT "topic_mastery_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turn" ADD CONSTRAINT "turn_attempt_id_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempt_session_idx" ON "attempt" USING btree ("session_id","order_index");--> statement-breakpoint
CREATE INDEX "child_parent_idx" ON "child_profile" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "parent_auth_user_idx" ON "parent_account" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "problem_topic_idx" ON "problem" USING btree ("topic_id","grade","difficulty");--> statement-breakpoint
CREATE INDEX "session_child_started_idx" ON "session" USING btree ("child_id","started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "topic_subject_grade_idx" ON "topic" USING btree ("subject_id","grade");--> statement-breakpoint
CREATE INDEX "turn_attempt_idx" ON "turn" USING btree ("attempt_id","created_at");