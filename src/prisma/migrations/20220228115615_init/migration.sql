/*
  Warnings:

  - The primary key for the `RoomItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `RoomItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RoomItem" DROP CONSTRAINT "RoomItem_pkey",
ADD CONSTRAINT "RoomItem_pkey" PRIMARY KEY ("roomId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomItem_id_key" ON "RoomItem"("id");
