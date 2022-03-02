/*
  Warnings:

  - You are about to drop the `RoomItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomItem" DROP CONSTRAINT "RoomItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RoomItem" DROP CONSTRAINT "RoomItem_roomId_fkey";

-- DropTable
DROP TABLE "RoomItem";
