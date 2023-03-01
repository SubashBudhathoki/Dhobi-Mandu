/*
  Warnings:

  - You are about to drop the `GeoNbr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeoNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GeoNbr` DROP FOREIGN KEY `GeoNbr_geoNodeId_fkey`;

-- DropTable
DROP TABLE `GeoNbr`;

-- DropTable
DROP TABLE `GeoNode`;
