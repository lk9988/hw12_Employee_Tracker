const inquirer = require("inquirer");
const connection = require("./connection");

module.exports = {
	getAllEmployees() {
		return connection.query(`
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
		ORDER BY employees.id, Department;`);
	},
	getDepartments() {
		return connection.query(`SELECT * FROM departments;`);
	},

	getEmployeesbyDepartment(chosenDept) {
		return connection.query(
			`
		SELECT e.first_name AS "First Name", 
		e.last_name AS "Last Name", 
		r.title AS "Title",
		CONCAT('$', FORMAT(r.salary,2)) AS "Salary", 
		d.name AS "Department" 
		FROM employees e
		INNER JOIN roles AS r ON r.id = e.role_id 
		INNER JOIN departments AS d ON d.id = r.department_id 
		WHERE d.id = ?;`,
			[chosenDept.id]
		);
	},
	getAllEmployeesbyManager() {
		return connection.query(`
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
		ORDER BY "Manager ID" DESC, department; `);
	},
	getManagers() {
		return connection.query(`
		SELECT
		DISTINCT employees.manager_id,
	   	CONCAT(manager.first_name, " ", manager.last_name) AS "Manager",
	   	departments.name AS "Department"
	    FROM employees 
	    LEFT JOIN employees manager on manager.id = employees.manager_id
		INNER JOIN roles ON (roles.id = employees.role_id)
		INNER JOIN departments ON (departments.id = roles.department_id)
	    WHERE manager.id IS NOT NULL;

		`);
	},
	getEmployeessbyManager(answer) {
		return connection.query(
			`
		SELECT
		employees.manager_id,
		CONCAT(manager.first_name, " ", manager.last_name) AS "Manager",
		departments.name AS "Department", 
		employees.id AS "ID", 
		CONCAT(employees.first_name," ", employees.last_name) AS "Employee", 
		roles.title AS "Role" 
		FROM employees 
		LEFT JOIN employees manager on manager.id = employees.manager_id
		INNER JOIN roles ON (roles.id = employees.role_id)
    	INNER JOIN departments ON (departments.id = roles.department_id)
		WHERE manager.id = ?;`,
			[answer.manager_id]
		);
	},

	getBudget() {
		return connection.query(`
		SELECT 
		departments.name AS "Department", 
		CONCAT('$', FORMAT(SUM(roles.salary),2)) AS "Utilized Budget"
		FROM employees
		LEFT JOIN roles 
		ON employees.id = roles.id
		LEFT JOIN departments
		ON departments.id = roles.department_id
		GROUP BY departments.name WITH ROLLUP; 
			`);
	},
	getAllRoles() {
		return connection.query(
			`SELECT departments.name AS "Department", 
			roles.title AS "Title"
			FROM roles 
			LEFT JOIN departments 
			ON departments.id = roles.department_id
			ORDER BY "Department"; `
		);
	},
	getRoleTable() {
		return connection.query(`SELECT  * FROM roles;`);
	},

	getRoleAndEmployees() {
		return connection.query(`
		SELECT * FROM roles;
		SELECT CONCAT(employees.first_name," ",employees.last_name) AS full_name, 
		employees.id
		FROM employees;
		`);
	},

	getName() {
		return connection.query(`SELECT CONCAT(e.first_name," ",e.last_name) AS full_name 
		FROM employees e`);
	},
	getRoleAndNames() {
		return connection.query(`

		SELECT employees.id,
 		CONCAT(employees.first_name," ", employees.last_name) as full_name,
		roles.title,
		roles.id AS role_id
		FROM employees
		LEFT JOIN employees manager on manager.id = employees.manager_id
		RIGHT JOIN roles ON (roles.id = employees.role_id)
		ORDER BY employees.id;
		
		`);
	},

	insertEmployee(answer) {
		return connection.query(
			`
		INSERT INTO employees (first_name, last_name, role_id, manager_id)
		VALUES (?, ?, ?, ?)
		`,
			[answer.newFirst, answer.newLast, answer.roleSelect, answer.managerSelect]
		);
	},
	getEmployeesList() {
		return connection.query(
			`SELECT employees.id, 
			CONCAT(employees.first_name," ", employees.last_name) as full_name
			FROM employees`
		);
	},

	insertRole(answer, res) {
		return connection.query(
			`INSERT INTO roles( title, salary, department_id)
						VALUES
						( "${answer.newTitle}" , "${answer.newSalary}", "${res.department_id}"); 
						`
		);
	},
	getRoleByDept(res) {
		return connection.query(
			`SELECT  departments.name AS "Department",
			roles.title,
			roles.id
			FROM roles 
			LEFT JOIN departments 
			ON departments.id = roles.department_id
			WHERE departments.id = ?;`,
			[res.department_id]
		);
	},
	deleteEmployee(res) {
		return connection.query(`DELETE FROM employees WHERE id = ?`, [
			res.selectEmp,
		]);
	},
	deleteRole(res) {
		return connection.query(`DELETE FROM roles WHERE id=?`, [res.removeRole]);
	},
	updateRole(res) {
		return connection.query(
			`
			UPDATE employees 
            SET role_id = ?
            WHERE id = ?;
			`,
			[res.updateRoleList, res.empList]
		);
	},
};

// module.exports = {
// 	getALL(table) {
// 		return connection.query("SELECT * FROM ??", table);
// 	},
// 	getDepartments() {
// 		return this.getALL("departments");
// 	},
// };
