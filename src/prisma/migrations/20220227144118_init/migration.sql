/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "dateReceived" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Inventory";
