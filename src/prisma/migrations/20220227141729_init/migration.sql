/*
  Warnings:

  - You are about to drop the column `orderImage` on the `ListItem` table. All the data in the column will be lost.
  - Added the required column `orderImage` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "orderImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "orderImage";
