/*
  Warnings:

  - Changed the type of `subject` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Table" AS ENUM ('User', 'Role', 'Permission', 'Room', 'Subject', 'Branch', 'Program', 'Stage', 'Class', 'Hall', 'Lecture', 'Hour', 'Day', 'Schedule', 'Channel', 'Specialty', 'Material', 'Year', 'Applicant', 'ApplicantBranch', 'Student', 'Degree');

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "subject",
ADD COLUMN     "subject" "Table" NOT NULL;

-- DropEnum
DROP TYPE "Tables";
