/*
  Warnings:

  - You are about to drop the column `itemId` on the `BrokenItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ExportedItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ListItem` table. All the data in the column will be lost.
  - Added the required column `name` to the `BrokenItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ExportedItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `roomId` on table `List` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BrokenItem" DROP CONSTRAINT "BrokenItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ExportedItem" DROP CONSTRAINT "ExportedItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_listId_fkey";

-- DropForeignKey
ALTER TABLE "RoomItem" DROP CONSTRAINT "RoomItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RoomItem" DROP CONSTRAINT "RoomItem_roomId_fkey";

-- DropIndex
DROP INDEX "BrokenItem_itemId_key";

-- DropIndex
DROP INDEX "ExportedItem_itemId_key";

-- AlterTable
ALTER TABLE "BrokenItem" DROP COLUMN "itemId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExportedItem" DROP COLUMN "itemId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "List" ALTER COLUMN "roomId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "itemId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomItem" ADD CONSTRAINT "RoomItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomItem" ADD CONSTRAINT "RoomItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
