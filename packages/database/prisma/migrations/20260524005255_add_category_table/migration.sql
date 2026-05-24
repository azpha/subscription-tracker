/*
  Warnings:

  - Added the required column `categoryId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "lastBillingDate" DATETIME NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "totalSpend" DECIMAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("billingFrequencyInMonths", "id", "image", "lastBillingDate", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend") SELECT "billingFrequencyInMonths", "id", "image", "lastBillingDate", "name", "nextBillingDate", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
