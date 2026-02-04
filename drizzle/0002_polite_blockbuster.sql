CREATE TABLE `accounts` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	FOREIGN KEY (`userId`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `avatar_pricing_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`pro_tier_markup` integer DEFAULT 150,
	`enterprise_markup` integer DEFAULT 130,
	`stt_cost_per_minute` integer DEFAULT 43,
	`tts_cost_per_1k_chars` integer DEFAULT 1800,
	`rtc_cost_per_minute` integer DEFAULT 99,
	`llm_cost_per_message` integer DEFAULT 200,
	`free_trial_messages_per_week` integer DEFAULT 3,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `avatar_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`avatar_type` text DEFAULT 'default',
	`avatar_model_url` text,
	`avatar_properties` text,
	`tts_provider` text DEFAULT 'elevenlabs',
	`voice_id` text,
	`voice_pitch` integer DEFAULT 100,
	`voice_speed` integer DEFAULT 100,
	`voice_tone` text DEFAULT 'professional',
	`property_overrides` text,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `avatar_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`message_count` integer DEFAULT 0,
	`last_reset_at` integer,
	`weekly_limit` integer DEFAULT 3,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `avatar_usage_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`message_count` integer DEFAULT 1,
	`audio_minutes` integer,
	`characters_generated` integer,
	`stt_cost` integer,
	`tts_cost` integer,
	`rtc_cost` integer,
	`llm_cost` integer,
	`total_cost` integer,
	`markup` integer,
	`charged_amount` integer,
	`billing_month` text,
	`conversation_id` text,
	`subscription_tier` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `category` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `subcategory` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `education_recommended` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `license_required` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `related_opportunities` text;