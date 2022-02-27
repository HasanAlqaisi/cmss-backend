/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_roomId_fkey";

-- AlterTable
ALTER TABLE "List" ALTER COLUMN "roomId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roomId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_roomId_key" ON "User"("roomId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
