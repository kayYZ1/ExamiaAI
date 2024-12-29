DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "sets" TO "sets" integer NOT NULL DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);