-- AlterTable
ALTER TABLE `User` ADD COLUMN `address_latitude` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `address_longitude` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Vendor` ADD COLUMN `address_latitude` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `address_longitude` DOUBLE NOT NULL DEFAULT 0;
