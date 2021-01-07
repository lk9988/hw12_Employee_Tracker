USE `employees_db`; 

INSERT INTO `departments`(`name`) VALUES ('Administration'); 
INSERT INTO `departments`(`name`) VALUES ('HR'); 
INSERT INTO `departments` (`name`)VALUES ('Sales'); 
INSERT INTO `departments` (`name`)VALUES ('Marketing'); 
INSERT INTO `departments` (`name`)VALUES ('Development'); 


INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Manager', '100000', '1'); 



INSERT INTO `employees` (`first_name`, `last_name` , `role_id` )VALUES ('Jane', 'Doe', '2' ); 