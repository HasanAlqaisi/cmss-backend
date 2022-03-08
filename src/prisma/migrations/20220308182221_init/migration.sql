/*
  Warnings:

  - You are about to drop the `absence` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Table" ADD VALUE 'Absence';

-- DropTable
DROP TABLE "absence";

-- CreateTable
CREATE TABLE "Absence" (
    "id" SERIAL NOT NULL,
    "firstWarning" INTEGER NOT NULL DEFAULT 3,
    "secondWarning" INTEGER NOT NULL DEFAULT 4,
    "thirdWarning" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);
