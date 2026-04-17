/*
  Warnings:

  - Added the required column `academicYear` to the `DraftTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `DraftTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYear` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DraftTemplate" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "calendarType" TEXT NOT NULL DEFAULT 'ethiopian',
ADD COLUMN     "semester" TEXT NOT NULL,
ADD COLUMN     "targetAudience" TEXT NOT NULL DEFAULT 'student';

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "calendarType" TEXT NOT NULL DEFAULT 'ethiopian',
ADD COLUMN     "semester" TEXT NOT NULL,
ADD COLUMN     "targetAudience" TEXT NOT NULL DEFAULT 'student';
