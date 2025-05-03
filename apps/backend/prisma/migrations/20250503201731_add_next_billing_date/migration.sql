/*
  Warnings:

  - Added the required column `nextBillingDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    "totalSpend" REAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Subscription" ("id", "name", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend") SELECT "id", "name", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
