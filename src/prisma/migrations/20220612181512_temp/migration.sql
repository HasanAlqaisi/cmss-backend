/*
  Warnings:

  - You are about to alter the column `average` on the `Applicant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - Made the column `average` on table `Applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "average" SET NOT NULL,
ALTER COLUMN "average" SET DATA TYPE DECIMAL(4,2);
