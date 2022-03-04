/*
  Warnings:

  - You are about to alter the column `totalDegree` on the `Applicant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `average` on the `Applicant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "totalDegree" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "average" SET DATA TYPE DOUBLE PRECISION;
