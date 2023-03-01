/*
  Warnings:

  - Added the required column `distance` to the `GeoNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GeoNode` ADD COLUMN `distance` DOUBLE NOT NULL;
