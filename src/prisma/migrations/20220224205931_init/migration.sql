/*
  Warnings:

  - The primary key for the `ApplicantBranch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `ApplicantBranch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApplicantBranch" DROP CONSTRAINT "ApplicantBranch_pkey",
ADD CONSTRAINT "ApplicantBranch_pkey" PRIMARY KEY ("applicantId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantBranch_id_key" ON "ApplicantBranch"("id");
