USE `employees_db`; 

INSERT INTO `departments`(`name`) VALUES ('Administration'); 
INSERT INTO `departments`(`name`) VALUES ('HR'); 
INSERT INTO `departments` (`name`)VALUES ('Sales'); 
INSERT INTO `departments` (`name`)VALUES ('Marketing'); 
INSERT INTO `departments` (`name`)VALUES ('Development'); 



INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('General Manager', '100000', 1); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Receptionist', '40000', 1); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('HR Specialist', '70000', 2); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Recruiter', '80000', 2); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Sales Specialist', '80000', 3); 

INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Branding Manager', '100000', 4); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Branding Specialist', '90000', 4); 
INSERT INTO `roles` (`title`, `salary`, `department_id`) VALUES ('Senior Software Engineer', '95000', 5); 


INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id`) VALUES ('Thomas', 'Gibson', 1, 1); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id` )VALUES ('David', 'Rossi', 2, 1); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id`) VALUES ('Jennifer', 'Jareau', 3, null); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id` )VALUES ('A.J.', 'Cook', 4, null ); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id` ,`manager_id`)VALUES ('Derek', 'Morgan', 5, null ); 

INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id` )VALUES ('Emily', 'Prentiss', 6, 6); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id` )VALUES ('Spencer', 'Reid', 7, 6 ); 
INSERT INTO `employees` (`first_name`, `last_name` , `role_id`,`manager_id` )VALUES ('Penelope', 'Garcia', 8, null) ; 




-- all employees 

SELECT employees.id, 
employees.first_name AS "First Name", 
employees.last_name "Last Name", 
roles.title AS "Title", 
departments.name AS "Department", 
CONCAT('$', FORMAT(roles.salary,2)) AS "Salary",
CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN employees manager on manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.role_id)
    INNER JOIN departments ON (departments.id = roles.department_id)
    ORDER BY employees.id, Department;



-- by department
SELECT e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title",CONCAT('$', FORMAT(r.salary,2)) AS "Salary", d.name AS "Department" FROM employees e
INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE d.name = 'HR';


-- view by department 
SELECT e.first_name AS "First Name", 
e.last_name AS "Last Name", 
r.title AS "Title",CONCAT('$', FORMAT(r.salary,2)) AS "Salary", 
d.name AS "Department" 
FROM employees e
INNER JOIN roles AS r ON r.id = e.role_id 
INNER JOIN departments AS d ON d.id = r.department_id 
WHERE d.name = 'HR'


-- view by manager 
SELECT
employees.manager_id AS "Manager ID",
CONCAT(manager.first_name, " ", manager.last_name) AS "Manager",
departments.name AS "Department", 
employees.id AS "ID", 
CONCAT(employees.first_name," ", employees.last_name) AS "Employee", 
roles.title AS "Role" 
FROM employees 
LEFT JOIN employees manager on manager.id = employees.manager_id
    INNER JOIN roles ON (roles.id = employees.role_id)
    INNER JOIN departments ON (departments.id = roles.department_id)
    ORDER BY "Manager ID" DESC, department; 