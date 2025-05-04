-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `lastBillingDate` DATETIME(3) NOT NULL,
    `nextBillingDate` DATETIME(3) NOT NULL,
    `billingFrequencyInMonths` INTEGER NOT NULL,
    `totalSpend` DOUBLE NOT NULL DEFAULT 0.00,
    `shouldNotifyExpiry` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
