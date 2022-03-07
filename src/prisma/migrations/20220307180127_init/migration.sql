/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
ALTER COLUMN "date" SET DATA TYPE DATE,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("lectureId", "studentId", "date");
