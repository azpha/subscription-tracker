-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "totalSpend" REAL NOT NULL,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true
);
