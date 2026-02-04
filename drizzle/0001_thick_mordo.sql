ALTER TABLE `affiliate_programs` ADD `estimated_commission_value` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `tier_rank` integer DEFAULT 99;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `business_plan` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `executive_summary` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `target_market` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `value_proposition` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `revenue_model` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `competitive_landscape` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `marketing_strategy` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `operations_overview` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `financial_projections` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `risk_analysis` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `milestones` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `startup_cost_range` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `time_to_revenue` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `skills_required` text;--> statement-breakpoint
ALTER TABLE `business_model_templates` ADD `complexity` integer DEFAULT 5;