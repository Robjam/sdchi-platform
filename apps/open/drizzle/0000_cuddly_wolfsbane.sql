CREATE TABLE `idp_auth_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text DEFAULT 'sdchi-auth' NOT NULL,
	`redirect_uri` text NOT NULL,
	`state` text NOT NULL,
	`nonce` text NOT NULL,
	`code_verifier` text NOT NULL,
	`challenge` text NOT NULL,
	`challenge_method` text NOT NULL,
	`scopes` text NOT NULL,
	`status` text DEFAULT 'initiated' NOT NULL,
	`auth_code` text,
	`user_id` text,
	`error` text,
	`expires_at` integer NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pkce_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`code_verifier` text NOT NULL,
	`code_challenge` text NOT NULL,
	`challenge_method` text DEFAULT 'S256' NOT NULL,
	`state` text NOT NULL,
	`client_id` text,
	`redirect_uri` text,
	`scope` text,
	`expires_at` integer NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_state` ON `pkce_requests` (`state`);--> statement-breakpoint
CREATE INDEX `idx_expires_at` ON `pkce_requests` (`expires_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`auth_source` text DEFAULT 'sdchi-auth' NOT NULL,
	`idp_auth_request_id` text,
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
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idp_auth_request_id`) REFERENCES `idp_auth_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sessions_expires_at` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text DEFAULT 'sdchi-auth' NOT NULL,
	`provider_sub` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`email` text,
	`email_verified` integer DEFAULT false,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `provider_idx` ON `users` (`provider_id`,`provider_sub`);