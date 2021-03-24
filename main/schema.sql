
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
    `salary` DECIMAL(8,2) NOT NULL, 
    `department_id` INT UNSIGNED NOT NULL, 
    INDEX `dep_index` (`department_id`), 
    CONSTRAINT `fk_departments` FOREIGN KEY(`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
 -- ON DELETE CASCADE -> Delete the row from pareent table and automaticall delete the marching row in the child table



); 

CREATE TABLE `employees` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR (30) NOT NULL DEFAULT '', 
    `last_name` VARCHAR (30) NOT NULL DEFAULT '',
    `role_id` INT UNSIGNED NOT NULL, 
    INDEX `role_index` (`role_id`),
    CONSTRAINT `fk_roles` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE, 
    `manager_id` INT UNSIGNED, 
    INDEX `manager_index` (`manager_id`), 
    CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL 
    -- ON DELETE SET NULL -> Delete the row from the parent table/department table/ and set the foreign key column in this table null 

 
); 
