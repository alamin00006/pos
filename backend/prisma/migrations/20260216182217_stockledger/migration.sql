/*
  Warnings:

  - You are about to drop the column `baseUnit` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `conversionRate` on the `Unit` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConversionSign" AS ENUM ('MULTIPLY', 'DIVIDE');

-- DropIndex
DROP INDEX "Unit_deletedAt_idx";

-- DropIndex
DROP INDEX "Unit_name_idx";

-- AlterTable
ALTER TABLE "StockLedger" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "baseUnit",
DROP COLUMN "conversionRate";

-- CreateTable
CREATE TABLE "UnitConversion" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "relatedToId" TEXT NOT NULL,
    "sign" TEXT NOT NULL DEFAULT '*',
    "factor" DECIMAL(12,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitConversion_unitId_key" ON "UnitConversion"("unitId");

-- CreateIndex
CREATE INDEX "UnitConversion_relatedToId_idx" ON "UnitConversion"("relatedToId");

-- CreateIndex
CREATE INDEX "StockLedger_createdById_idx" ON "StockLedger"("createdById");

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_relatedToId_fkey" FOREIGN KEY ("relatedToId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLedger" ADD CONSTRAINT "StockLedger_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
