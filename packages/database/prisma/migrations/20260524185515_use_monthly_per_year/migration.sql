/*
  Warnings:

  - You are about to drop the column `month` on the `MonthlyReport` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `MonthlyReport` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthlyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "jan" DECIMAL,
    "feb" DECIMAL,
    "mar" DECIMAL,
    "apr" DECIMAL,
    "may" DECIMAL,
    "jun" DECIMAL,
    "jul" DECIMAL,
    "aug" DECIMAL,
    "sept" DECIMAL,
    "oct" DECIMAL,
    "nov" DECIMAL,
    "dec" DECIMAL
);
INSERT INTO "new_MonthlyReport" ("id", "year") SELECT "id", "year" FROM "MonthlyReport";
DROP TABLE "MonthlyReport";
ALTER TABLE "new_MonthlyReport" RENAME TO "MonthlyReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
