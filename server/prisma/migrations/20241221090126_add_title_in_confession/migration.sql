/*
  Warnings:

  - Added the required column `title` to the `Confession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Confession" ADD COLUMN     "title" TEXT NOT NULL;
