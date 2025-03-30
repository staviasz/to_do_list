/*
  Warnings:

  - You are about to drop the column `title` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `date_of_completion` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "title",
ADD COLUMN     "date_of_completion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
