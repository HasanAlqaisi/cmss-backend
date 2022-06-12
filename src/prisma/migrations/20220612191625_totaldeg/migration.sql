/*
  Warnings:

  - Made the column `totalDegree` on table `Applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "totalDegree" SET NOT NULL,
ALTER COLUMN "totalDegree" SET DEFAULT 0;
