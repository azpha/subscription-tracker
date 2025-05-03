/*
  Warnings:

  - Added the required column `billingFrequencyInMonths` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastBillingDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "lastBillingDate" TEXT NOT NULL,
    "nextBillingDate" TEXT NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "totalSpend" REAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Subscription" ("id", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend") SELECT "id", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
