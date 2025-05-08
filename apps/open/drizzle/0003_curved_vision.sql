CREATE TABLE `business_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`weekly_template` text NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `business_hours_user_id_idx` ON `business_hours` (`user_id`);--> statement-breakpoint
CREATE INDEX `business_hours_user_default_idx` ON `business_hours` (`user_id`,`is_default`);