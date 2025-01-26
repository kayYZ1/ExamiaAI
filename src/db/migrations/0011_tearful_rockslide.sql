CREATE TABLE `scores` (
	`id` text PRIMARY KEY NOT NULL,
	`examId` text NOT NULL,
	`fullName` text NOT NULL,
	`score` integer NOT NULL,
	`sessionCode` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action
);
