-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role" NOT NULL DEFAULT 'STUDENT';
