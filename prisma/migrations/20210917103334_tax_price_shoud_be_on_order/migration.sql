/*
  Warnings:

  - You are about to drop the column `taxPrice` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "taxPrice" DOUBLE PRECISION DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "taxPrice";
