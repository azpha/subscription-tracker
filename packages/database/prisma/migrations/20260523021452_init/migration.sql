-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "lastBillingDate" DATETIME NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "totalSpend" DECIMAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true
);
