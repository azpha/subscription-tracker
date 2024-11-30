/*
  Warnings:

  - Added the required column `type` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "type" TEXT NOT NULL;
