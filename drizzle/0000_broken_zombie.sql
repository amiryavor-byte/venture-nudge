CREATE TABLE `affiliate_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`commission_type` text,
	`commission_rate` text,
	`commission_notes` text,
	`signup_url` text NOT NULL,
	`affiliate_dashboard_url` text,
	`api_docs_url` text,
	`terms_url` text,
	`has_api` integer DEFAULT false,
	`api_integration_status` text DEFAULT 'none',
	`cookie_duration` integer,
	`status` text DEFAULT 'active',
	`phase_out_date` text,
	`replaced_by` text,
	`target_industries` text,
	`target_business_types` text,
	`recommendation_timing` text,
	`priority` integer DEFAULT 5,
	`total_conversions` integer DEFAULT 0,
	`total_revenue` integer DEFAULT 0,
	`average_commission` integer DEFAULT 0,
	`last_conversion_date` integer,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `affiliate_referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_id` text,
	`user_id` text,
	`clicked_at` integer,
	`converted_at` integer,
	`status` text DEFAULT 'pending',
	`commission_amount` integer,
	`referral_code` text,
	`source_context` text,
	FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`category` text DEFAULT 'general',
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_settings_key_unique` ON `app_settings` (`key`);--> statement-breakpoint
CREATE TABLE `business_concepts` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`name` text NOT NULL,
	`description` text,
	`fit_reason` text,
	`concept_type` text,
	`created_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `business_model_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`industry` text NOT NULL,
	`description` text,
	`operational_guide` text,
	`key_metrics` text,
	`is_verified` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `business_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`problem` text,
	`target_audience` text,
	`solution` text,
	`monetization` text,
	`content` text,
	`status` text DEFAULT 'draft',
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `interests` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`name` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pricing_config` (
	`id` text PRIMARY KEY NOT NULL,
	`tier` text NOT NULL,
	`price_in_cents` integer NOT NULL,
	`display_price` text NOT NULL,
	`billing_period` text,
	`features` text,
	`is_active` integer DEFAULT true,
	`sort_order` integer DEFAULT 0,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pricing_config_tier_unique` ON `pricing_config` (`tier`);--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`plan_id` text,
	`credits_granted` integer,
	`stripe_payment_id` text,
	`status` text DEFAULT 'pending',
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text,
	`name` text NOT NULL,
	`level` text,
	FOREIGN KEY (`profile_id`) REFERENCES `user_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `theme_config` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT false,
	`is_custom` integer DEFAULT false,
	`colors` text NOT NULL,
	`fonts` text NOT NULL,
	`spacing` text,
	`border_radius` text,
	`shadows` text,
	`images` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`email` text,
	`password_hash` text,
	`name` text,
	`role` text DEFAULT 'user',
	`is_active` integer DEFAULT true,
	`available_capital` text,
	`risk_tolerance` text,
	`preferred_time_commitment` text,
	`location` text,
	`discovery_profile` text,
	`subscription_tier` text DEFAULT 'free',
	`subscription_status` text DEFAULT 'active',
	`subscription_start_date` integer,
	`subscription_end_date` integer,
	`stripe_customer_id` text,
	`ai_credits` integer DEFAULT 0,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_email_unique` ON `user_profiles` (`email`);