-- CreateTable
CREATE TABLE `GeoNode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `parent` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeoNbr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `geoNodeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GeoNbr` ADD CONSTRAINT `GeoNbr_geoNodeId_fkey` FOREIGN KEY (`geoNodeId`) REFERENCES `GeoNode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
