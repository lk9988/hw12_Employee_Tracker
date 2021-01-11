const inquirer = require("inquirer");
const { createBrotliDecompress } = require("zlib");
const db = require("./main/db");
const chalk = require("chalk");
const cTable = require("console.table");
const connection = require("./main/db/connection");
const Choice = require("inquirer/lib/objects/choice");
const { getEmployeesbyDepartment, getBudget } = require("./main/db");

function askForAction() {
	inquirer
		.prompt({
			message: "What would you like to do?",
			name: "action",
			type: "list",
			choices: [
				"VIEW_ALL_EMPLOYEES",
				"VIEW_DEPARTMENTS",
				"ADD_DEPARTMENT",
				"REMOVE_DEPARTMENTS",
				"VIEW_ALL_ROLES",
				"ADD_ROLE",
				"REMOVE_ROLE",
				"ADD_EMPLOYEE",
				"REMOVE_EMPLOYEE",
				"UPDATE_EMPLOYEE",
				"VIEW_ALL_EMPLOYEES_BY_DEPARTMENT",
				"VIEW_ALL_EMPLOYEES_BY_MANAGER",
				"VIEW_EMPLOYEES_BY_MANAGER",
				"VIEW_TOTAL_UTILIZED_BUDGET_OF_DEPARTMENT",
				"QUIT",
			],
		})
		.then((res) => {
			switch (res.action) {
				case "VIEW_ALL_EMPLOYEES":
					viewALLEmployees();
					return;

				case "VIEW_DEPARTMENTS":
					viewAllDepartments();
					return;

				case "ADD_DEPARTMENT":
					addDepartment();
					return;
				case "REMOVE_DEPARTMENTS":
					removeDepartment();
					return;

				case "VIEW_ALL_ROLES":
					viewALLRoles();
					return;

				case "ADD_ROLE":
					addRole();
					return;

				case "REMOVE_ROLE":
					removeRole();
					return;

				case "ADD_EMPLOYEE":
					return;

				case "REMOVE_EMPLOYEE":
					return;

				case "UPDATE_EMPLOYEE":
					return;

				case "VIEW_ALL_EMPLOYEES_BY_DEPARTMENT":
					viewEmployeeByDepartment();
					return;
				case "VIEW_ALL_EMPLOYEES_BY_MANAGER":
					viewAllbyManager();
					return;

				case "VIEW_EMPLOYEES_BY_MANAGER":
					viewbyManager();
					return;

				case "VIEW_TOTAL_UTILIZED_BUDGET_OF_DEPARTMENT":
					viewBudgetByDept();
					return;

				default:
					connection.end();
			}
		});
}

function viewALLEmployees() {
	db.getAllEmployees().then((res) => {
		console.log("\n");
		console.log(chalk.yellow("All Employees"));
		console.log("\n");
		console.table(res);
		console.log("\n");

		askForAction();
	});
}
function viewAllDepartments() {
	db.getDepartments()
		// only works because of util.promisify
		// also db.index.js file, must return connection.query
		// otherwise, .then change will not work
		.then((res) => {
			console.log("\n");
			console.log(chalk.yellow("View All Departments"));
			console.log("\n");
			console.table(res);
			console.log("\n");
			askForAction();
		});
}
function addDepartment() {
	db.getDepartments().then((res) => {
		console.log("\n");
		console.table(chalk.yellow("List of All current Departments"), res);

		inquirer
			.prompt([
				{
					name: "newDept",
					type: "input",
					message: "Enter the name of new department to ADD",
				},
			])
			.then((answer) => {
				connection
					.query(`INSERT INTO departments(name) VALUES ?; `, answer.newDept)
					.then(
						db.getDepartments().then((res) => {
							console.log("\n");
							console.log(chalk.green("Department Successfully is Added"));
							console.table(
								chalk.yellow("List of All current Departments"),
								res
							);
						})
					);

				askForAction();
			});
	});
}

function removeDepartment() {
	db.getDepartments().then((res) => {
		inquirer
			.prompt([
				{
					name: "removeDept",
					type: "list",
					choices: function () {
						let choiceArray = res.map((choice) => choice.name);
						return choiceArray;
					},
					message: "Select the department you wish to remove",
				},
			])
			.then((answer) => {
				connection
					.query(`DELETE FROM departments WHERE ? `, {
						name: answer.removeDept,
					})
					.then(
						db.getDepartments().then((res) => {
							console.log("\n");
							console.log(chalk.green("Department Successfully is Removed"));
							console.table(
								chalk.yellow("List of All current Departments"),
								res
							);
						})
					);
			});
	});
}

function viewEmployeeByDepartment() {
	db.getDepartments().then((res) => {
		// console.log(res, "res");
		// getting rowdata.. okay

		inquirer
			.prompt([
				{
					name: "deptChoice",
					type: "list",
					choices: function () {
						let deptArray = res.map((choice) => choice.name);
						return deptArray;
					},
					message: "Select a Department to view",
				},
			])
			.then((answer) => {
				let chosenDept;
				for (let i = 0; i < res.length; i++) {
					if (res[i].name === answer.deptChoice) {
						chosenDept = res[i];
					}
				}
				console.log(chosenDept, "choice");
				db.getEmployeesbyDepartment(chosenDept.id).then((res) => {
					console.log("\n");
					console.log(
						chalk.yellow(`All Employees by Department: ${chosenDept.name}`)
					);
					console.log("\n");
					console.table(res);
					console.log("\n");
					askForAction();
				});
			});
	});
}

function viewALLRoles() {
	db.getAllRoles().then((res) => {
		console.log("\n");
		console.log(chalk.yellow("View All Roles By department"));
		console.log("\n");
		console.table(res);
		console.log("\n");
		askForAction();
	});
}

function addRole() {
	db.getDepartments().then((departments) => {
		console.log(departments);
		// this returns whole date from departments table
		// {id:1 , name: departmentname}

		const departmentChoices = departments.map((department) => ({
			value: department.id,
			name: department.name,
		}));
		inquirer
			.prompt([
				{
					name: "department_id",
					type: "list",
					message: "Which department is this role for?",
					choices: departmentChoices,
				},
			])
			.then((res) => {
				console.log(res);
				// this will return
				// {department_id: 2}
				inquirer
					.prompt([
						{
							name: "newTitle",
							type: "input",
							message: "Enter the new title",
						},
						{
							name: "newSalary",
							type: "input",
							message: "Enter the salary for the new title",
							validate: (val) =>
								/[0-9]/gi.test(val) || "Please enter valid number",
						},
					])

					.then((answer) => {
						console.log(answer, res, "answer");
						db.insertRole(answer, res).then((res) => {
							console.log("\n");
							console.log(chalk.green("New Title Successfully is Added"));
							console.log("\n");
							askForAction();
						});
					});
			});
	});
}

function removeRole() {
	db.getDepartments().then((departments) => {
		const departmentChoices = departments.map((department) => ({
			value: department.id,
			name: department.name,
		}));

		inquirer
			.prompt([
				{
					name: "department_id",
					type: "list",
					message: "Which department is this role for?",
					choices: departmentChoices,
				},
			])
			.then((res) => {
				console.log(res);
				db.getRoleByDept(res).then((roles) => {
					const roleChoices = roles.map((role) => ({
						value: role.id,
						name: role.title,
					}));
					console.log(roleChoices, "roleChoice");
					inquirer
						.prompt([
							{
								name: "removeRole",
								type: "list",
								message: "Select the title you wish to remove",
								choices: roleChoices,
							},
						])
						.then((res) => {
							console.log(res);
							db.deleteRole(res).then(() => {
								console.log("\n");
								console.log(chalk.green("New Title Successfully is Removed"));
								console.log("\n");
								askForAction();
							});
						});
				});
			});
	});
}
function viewBudgetByDept() {
	db.getBudget().then((res) => {
		console.log("\n");
		console.log(chalk.yellow("View Total Utilized Budget by Department"));
		console.log("\n");
		console.table(res);
		console.log("\n");
		askForAction();
	});
}

function viewAllbyManager() {
	db.getAllEmployeesbyManager().then((res) => {
		console.log("\n");
		console.log(chalk.yellow("View All Employees by Manager"));
		console.log("\n");
		console.table(res);
		console.log("\n");
		askForAction();
	});
}
function viewbyManager() {
	db.getManagers().then((managers) => {
		console.log(managers);
		const managerChoices = managers.map((manager) => ({
			value: manager.manager_id,
			name: manager.Manager,
		}));
		inquirer
			.prompt([
				{
					name: "manager_id",
					type: "list",
					message: "Select a Manager",
					choices: managerChoices,
				},
			])
			.then((answer) => {
				console.log(answer);
				//return { manager_id: 1 }

				db.getEmployeessbyManager(answer).then((res) => {
					// console.log(answer, "manager_id");
					console.log("\n");
					console.log(chalk.yellow("View Employees by Manager"));
					console.log("\n");
					console.table(res);
					console.log("\n");
					askForAction();
				});
			});
	});
}

askForAction();
