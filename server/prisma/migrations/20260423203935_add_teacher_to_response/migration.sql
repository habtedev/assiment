-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "teacherId" INTEGER;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
