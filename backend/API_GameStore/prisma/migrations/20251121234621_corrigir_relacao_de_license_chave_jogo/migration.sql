/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[orderId,gameId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "LicenseKey" (
    "id" SERIAL NOT NULL,
    "keyString" VARCHAR(50) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "gameId" INTEGER NOT NULL,
    "orderItemId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_keyString_key" ON "LicenseKey"("keyString");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_orderItemId_key" ON "LicenseKey"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_gameId_key" ON "OrderItem"("orderId", "gameId");

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
