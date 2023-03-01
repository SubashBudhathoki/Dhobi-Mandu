/*
  Warnings:

  - You are about to drop the column `name` on the `GeoNbr` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `GeoNbr` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `GeoNode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GeoNbr` DROP COLUMN `name`,
    DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `GeoNode` DROP COLUMN `name`;
