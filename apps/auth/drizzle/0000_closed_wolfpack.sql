CREATE TABLE `idp_auth_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`auth_request_id` text NOT NULL,
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
	FOREIGN KEY (`provider_id`) REFERENCES `idps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`auth_request_id`) REFERENCES `sdchi_auth_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `idp_sdchi_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`sdchi_client_id` text NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `idps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sdchi_client_id`) REFERENCES `sdchi_clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `idps` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`client_secret` text NOT NULL,
	`discovery_url` text,
	`authorization_url` text,
	`token_url` text,
	`user_info_url` text,
	`scopes` text NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_provider_id` ON `idps` (`id`);--> statement-breakpoint
CREATE TABLE `sdchi_auth_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`redirect_uri` text NOT NULL,
	`response_type` text NOT NULL,
	`state` text NOT NULL,
	`challenge` text NOT NULL,
	`challenge_method` text NOT NULL,
	`scope` text NOT NULL,
	`status` text DEFAULT 'initiated' NOT NULL,
	`error` text,
	`expires_at` integer NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`client_id`) REFERENCES `sdchi_clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sdchi_authorization_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`expires_at` integer NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`auth_request_id`) REFERENCES `sdchi_auth_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sdchi_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`application_name` text NOT NULL,
	`redirect_uris` text NOT NULL,
	`token_secret` text NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `session_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`activity_type` text NOT NULL,
	`description` text,
	`ip_address` text,
	`user_agent` text,
	`location` text,
	`successful` integer NOT NULL,
	`failure_reason` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session_devices` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`device_id` text,
	`device_type` text,
	`device_name` text,
	`device_model` text,
	`os_name` text,
	`os_version` text,
	`browser_name` text,
	`browser_version` text,
	`last_seen_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_ip` text,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`auth_source` text NOT NULL,
	`sdchi_auth_request_id` text,
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
	FOREIGN KEY (`sdchi_auth_request_id`) REFERENCES `sdchi_auth_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`idp_auth_request_id`) REFERENCES `idp_auth_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sessions_expires_at` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`provider_sub` text NOT NULL,
	`email` text,
	`email_verified` integer DEFAULT false,
	`updated_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `idps`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `provider_idx` ON `users` (`provider_id`,`provider_sub`);