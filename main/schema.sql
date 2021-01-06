
DROP DATABASE IF EXISTS `employees_db`; 
CREATE DATABASE `employees_db` DEFAULT CHARACTER SET utf8mb4; 

USE `employees_db`; 

CREATE TABLE `departments`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(30) UNIQUE NOT NULL DEFAULT ''
); 

CREATE TABLE `roles` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(30) UNIQUE NOT NULL DEFAULT '', 
    `salary` DECIMAL NOT NULL, 
    `department_id` INT UNSIGNED NOT NULL, 
    INDEX `dep_index` (`department_id`), 
    CONSTRAINT `fk_departments` FOREIGN KEY(`department_id`) REFERENCES `departments`(`id`)
 

); 

CREATE TABLE `employees` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR (30) NOT NULL DEFAULT '', 
    `last_name` VARCHAR (30) NOT NULL DEFAULT '',
    `role_id` INT UNSIGNED NOT NULL, 
    INDEX `role_index` (`role_id`),
    CONSTRAINT `fk_roles` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`), 
    `manager_id` INT UNSIGNED, 
    INDEX `manager_index` (`manager_id`), 
    CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) 

 
); 
