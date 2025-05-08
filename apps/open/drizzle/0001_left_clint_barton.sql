CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`prompt` text NOT NULL,
	`response` text NOT NULL,
	`rating` numeric DEFAULT 0,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_prompts_user_id` ON `prompts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_prompts_prompt` ON `prompts` (`prompt`);--> statement-breakpoint
CREATE INDEX `idx_prompts_response` ON `prompts` (`response`);--> statement-breakpoint
DROP TABLE `pkce_requests`;--> statement-breakpoint
CREATE INDEX `idx_idp_auth_requests_provider_status` ON `idp_auth_requests` (`provider_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_idp_auth_requests_user_id` ON `idp_auth_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_idp_auth_requests_expires_at` ON `idp_auth_requests` (`expires_at`);