-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Table" ADD VALUE 'Category';
ALTER TYPE "Table" ADD VALUE 'Item';
ALTER TYPE "Table" ADD VALUE 'BrokenItem';
ALTER TYPE "Table" ADD VALUE 'ExportedItem';
ALTER TYPE "Table" ADD VALUE 'List';
ALTER TYPE "Table" ADD VALUE 'ListItem';
ALTER TYPE "Table" ADD VALUE 'Attendance';

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
