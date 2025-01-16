CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`setId` text NOT NULL,
	`title` text NOT NULL,
	`participants` integer NOT NULL,
	`start` integer NOT NULL,
	`duration` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`setId`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
