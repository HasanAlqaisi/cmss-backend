-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_hallId_fkey";

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;
