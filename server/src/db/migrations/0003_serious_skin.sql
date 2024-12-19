DROP INDEX `users_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `alias` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan` text DEFAULT 'Basic' NOT NULL;