-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "billingDate" DATETIME NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "totalSpend" DECIMAL NOT NULL DEFAULT 0.00,
    "shouldNotifyExpiry" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER,
    CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
