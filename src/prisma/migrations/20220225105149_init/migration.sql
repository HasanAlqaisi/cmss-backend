/*
  Warnings:

  - Added the required column `priority` to the `ApplicantBranch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicantBranch" ADD COLUMN     "priority" INTEGER NOT NULL;
