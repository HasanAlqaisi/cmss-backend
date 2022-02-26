/*
  Warnings:

  - The values [all] on the enum `Table` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Table_new" AS ENUM ('User', 'Role', 'Permission', 'Room', 'Subject', 'Branch', 'Program', 'Stage', 'Class', 'Hall', 'Lecture', 'Hour', 'Day', 'Schedule', 'Channel', 'Specialty', 'Material', 'Year', 'Applicant', 'ApplicantBranch', 'Student', 'Degree');
ALTER TABLE "Permission" ALTER COLUMN "subject" TYPE "Table_new" USING ("subject"::text::"Table_new");
ALTER TYPE "Table" RENAME TO "Table_old";
ALTER TYPE "Table_new" RENAME TO "Table";
DROP TYPE "Table_old";
COMMIT;
