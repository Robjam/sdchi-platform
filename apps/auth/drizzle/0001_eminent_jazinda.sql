CREATE TABLE `portal_admins` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`provider_sub` text NOT NULL,
	`email` text,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `portal_auth_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`redirect_uri` text NOT NULL,
	`response_type` text NOT NULL,
	`state` text NOT NULL,
	`nonce` text NOT NULL,
	`code_verifier` text NOT NULL,
	`challenge` text NOT NULL,
	`challenge_method` text NOT NULL,
	`scope` text NOT NULL,
	`status` text DEFAULT 'initiated' NOT NULL,
	`error` text,
	`expires_at` integer NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `portal_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`auth_source` text NOT NULL,
	`portal_auth_request_id` text,
	`user_agent` text,
	`ip_address` text,
	`active` integer DEFAULT true NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`token_type` text DEFAULT 'Bearer',
	`scope` text,
	`expires_at` integer NOT NULL,
	`refresh_token_expires_at` integer,
	`last_active_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`revoked_at` integer,
	`revoked_reason` text,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `portal_admins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`portal_auth_request_id`) REFERENCES `portal_auth_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_portal_sessions_user_id` ON `portal_sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_portal_sessions_expires_at` ON `portal_sessions` (`expires_at`);