/*
  Warnings:

  - You are about to drop the column `studentId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "studentId";
