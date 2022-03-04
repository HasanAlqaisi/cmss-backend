/*
  Warnings:

  - You are about to drop the column `capacity` on the `Specialty` table. All the data in the column will be lost.
  - Added the required column `minAvg` to the `Specialty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "Specialty" DROP COLUMN "capacity",
ADD COLUMN     "customPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minAvg" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
