/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "imageUrl",
ADD COLUMN     "coverUrl" TEXT;

-- CreateTable
CREATE TABLE "GameMedia" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "GameMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameMedia" ADD CONSTRAINT "GameMedia_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
