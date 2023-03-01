/*
  Warnings:

  - The primary key for the `GeoNode` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `GeoNbr` DROP FOREIGN KEY `GeoNbr_geoNodeId_fkey`;

-- AlterTable
ALTER TABLE `GeoNbr` MODIFY `geoNodeId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `GeoNode` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `GeoNbr` ADD CONSTRAINT `GeoNbr_geoNodeId_fkey` FOREIGN KEY (`geoNodeId`) REFERENCES `GeoNode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
