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
	getEmployeesbyManager() {
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
	deleteRole(res) {
		return connection.query(`DELETE FROM roles WHERE id=?`, [res.removeRole]);
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
