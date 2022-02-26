/*
  Warnings:

  - Changed the type of `subject` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tables" AS ENUM ('Specialty');

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "subject",
ADD COLUMN     "subject" "Tables" NOT NULL;
