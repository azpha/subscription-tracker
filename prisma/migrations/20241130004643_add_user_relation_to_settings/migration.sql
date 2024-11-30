/*
  Warnings:

  - Added the required column `userId` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
