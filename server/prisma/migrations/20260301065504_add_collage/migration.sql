/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `College` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYear` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `College` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `College` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "College_name_key";

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" JSONB NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "College_code_key" ON "College"("code");
