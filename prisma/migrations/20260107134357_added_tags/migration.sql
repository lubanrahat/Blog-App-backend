/*
  Warnings:

  - You are about to drop the column `ags` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "ags",
ADD COLUMN     "tags" TEXT[];
