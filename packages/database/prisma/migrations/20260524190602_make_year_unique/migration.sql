/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `MonthlyReport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReport_year_key" ON "MonthlyReport"("year");
