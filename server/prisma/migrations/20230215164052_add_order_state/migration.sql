/*
  Warnings:

  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `state` ENUM('RECEIVED', 'WASHING', 'SHIPPING', 'CANCELLED', 'COMPLETED') NOT NULL;
