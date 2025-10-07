CREATE TABLE `signups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`is_bot_flagged` integer DEFAULT false NOT NULL,
	`canary_field_touched` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `signups_email_unique` ON `signups` (`email`);