const inquirer = require("inquirer");
const { createBrotliDecompress } = require("zlib");
const db = require("./main/db");
const chalk = require("chalk");
const cTable = require("console.table");
const connection = require("./main/db/connection");
const Choice = require("inquirer/lib/objects/choice");
const { getEmployeesbyDepartment, getBudget } = require("./main/db");
const { KeyObject } = require("crypto");

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
					addEmployee();
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

// function addEmployee() {
// 	inquirer
// 		.prompt([
// 			{
// 				name: "checkRole",
// 				type: "confirm",
// 				message: "Did you add the role for this employee?",
// 			},
// 		])
// 		.then((answer) => {
// 			if (!answer.checkRole) {
// 				console.log(chalk.red("Please add role first ! "));
// 				addRole();
// 			} else {
// 				db.getRoleAndNames().then((results) => {
// 					console.log(results, "results");
// 					const roleChoices = results.map((result) => ({
// 						value: result.role_id,
// 						name: result.title,
// 					}));
// 					console.log(roleChoices, "roleChoices");

// 					inquirer
// 						.prompt([
// 							{
// 								name: "newFirst",
// 								type: "input",
// 								message: "Enter first name of new employee.",
// 							},
// 							{
// 								name: "newLast",
// 								type: "input",
// 								message: "Enter last name of new employee.",
// 							},
// 							{
// 								name: "roleSelect",
// 								type: "list",
// 								message: "Select role of new employee",
// 								choices: roleChoices,

// 								// function () {
// 								// 	let choiceArray = results.map((choice) => choice.title);
// 								// 	return choiceArray;
// 								// },
// 							},
// 							// {
// 							// 	name: "managerSelect",
// 							// 	type: "list",
// 							// 	message: "Select Manager for this employee",
// 							// 	choices: function () {
// 							// 		// let choiceArray = results.filter((choice) => {
// 							// 		// 	return choice.id != null;
// 							// 		// });
// 							// 		///// this giving me undefinds............

// 							// 		// let choiceArray = results.filter(Boolean);
// 							// 		let filteredArray = results.filter(Boolean);

// 							// 		return choiceArray;
// 							// 		///// this giving me undefinds............
// 							// 	},
// 							// },
// 						])
// 						.then((res) => {
// 							console.log(res, "resres");
// 							const roleResult = res;
// 							// this res { newFirst: 'what', newLast: 'name', roleSelect: 3 } resres
// 							// but does not get past to....
// 							// this is messy...
// 							// need to find a way ... need to have last Q in same block..
// 							db.getName().then((results) => {
// 								console.log(results, "line 403");
// 								inquirer
// 									.prompt([
// 										{
// 											name: "managerSelect",
// 											type: "list",
// 											message: "Select Manager for this employee",
// 											choices: function () {
// 												let choiceArray = results.map(
// 													(choice) => choice.full_name
// 												);
// 												choiceArray.push("No Manager");
// 												return choiceArray;
// 											},
// 										},
// 									])
// 									.then((managerResult, data) => {
// 										console.log(results, managerResult, "res4444");
// 										console.log(roleResult, "resmymym");

// 										db.insertEmployee(results, roleResult).then((res) => {
// 											console.log("\n");
// 											console.log(
// 												chalk.green("New Employee Successfully is Added")
// 											);
// 											console.log("\n");
// 											askForAction();
// 										});

// 										// this results -> list of names
// 										// res => managerSelect :name
// 									});
// 							});
// 						});
// 				});
// 			}
// 		});
// }

function addEmployee() {
	inquirer
		.prompt([
			{
				name: "checkRole",
				type: "confirm",
				message: "Did you add the role for this employee?",
			},
		])
		.then((answer) => {
			if (!answer.checkRole) {
				console.log(chalk.red("Please add role first ! "));
				addRole();
			} else {
				db.getRoleAndEmployees().then((results) => {
					inquirer
						.prompt([
							{
								name: "newFirst",
								type: "input",
								message: "Enter first name of new employee.",
							},
							{
								name: "newLast",
								type: "input",
								message: "Enter last name of new employee.",
							},
							{
								name: "roleSelect",
								type: "list",
								message: "Select role of new employee",
								choices: function () {
									let choiceArray = results[0].map((choice) => choice.title);
									return choiceArray;
								},
							},
							{
								name: "managerSelect",
								type: "list",
								message: "Select Manager for this employee",
								choices: function () {
									let choiceArray = results[1].map(
										(choice) => choice.full_name
									);
									return choiceArray;
								},
							},
						])
						.then((res) => {
							console.log(res, "resres");
						});
				});
			}
		});
}

askForAction();
