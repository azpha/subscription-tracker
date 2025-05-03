/*
  Warnings:

  - You are about to alter the column `lastBillingDate` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `nextBillingDate` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "lastBillingDate" DATETIME NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "totalSpend" REAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Subscription" ("billingFrequencyInMonths", "id", "lastBillingDate", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend") SELECT "billingFrequencyInMonths", "id", "lastBillingDate", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
