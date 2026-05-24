-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "billingDate" DATETIME NOT NULL,
    "totalSpend" DECIMAL NOT NULL DEFAULT 0.00,
    "previousTotalSpend" DECIMAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER,
    CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("billingDate", "categoryId", "id", "image", "name", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend") SELECT "billingDate", "categoryId", "id", "image", "name", "paymentMethod", "price", "shouldNotifyExpiry", "totalSpend" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
