/*
  Warnings:

  - You are about to drop the column `forgetPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `forgetPasswordExp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "forgetPassword",
DROP COLUMN "forgetPasswordExp",
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExp" TIMESTAMP(3);
