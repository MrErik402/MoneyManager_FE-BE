ALTER TABLE `transactions` 
ADD COLUMN `isRecurring` TINYINT(1) DEFAULT 0 NOT NULL AFTER `type`,
ADD COLUMN `recurrenceFrequency` VARCHAR(20) NULL AFTER `isRecurring`,
ADD COLUMN `nextRecurrenceDate` DATETIME NULL AFTER `recurrenceFrequency`,
ADD COLUMN `originalTransactionID` VARCHAR(255) NULL AFTER `nextRecurrenceDate`;

CREATE TABLE IF NOT EXISTS `user_notification_preferences` (
  `id` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `lowBalanceThreshold` INT(11) DEFAULT 1000,
  `negativeBalanceEnabled` TINYINT(1) DEFAULT 1,
  `highBalanceThreshold` INT(11) DEFAULT 10000000,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userID` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


