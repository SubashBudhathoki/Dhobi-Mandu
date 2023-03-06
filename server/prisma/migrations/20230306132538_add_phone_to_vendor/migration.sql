/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Vendor` ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Vendor_phone_key` ON `Vendor`(`phone`);
