/*
  Warnings:

  - A unique constraint covering the columns `[name,specialtyId]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Material_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_specialtyId_key" ON "Material"("name", "specialtyId");
