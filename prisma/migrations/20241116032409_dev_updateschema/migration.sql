-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "billingMethod" TEXT NOT NULL,
    "billingFrequencyInMonths" INTEGER NOT NULL,
    "image" TEXT,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
