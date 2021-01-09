const inquirer = require("inquirer");
const { createBrotliDecompress } = require("zlib");
const db = require("./main/db");
const chalk = require("chalk");
const cTable = require("console.table");
const connection = require("./main/db/connection");
const Choice = require("inquirer/lib/objects/choice");
const { getEmployeesbyDepartment } = require("./main/db");

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
				"CREATE_ROLE",
				"REMOVE_ROLE",
				"ADD_EMPLOYEE",
				"REMOVE_EMPLOYEE",
				"UPDATE_EMPLOYEE",
				"VIEW_ALL_EMPLOYEES_BY_DEPARTMENT",
				"VIEW_ALL_EMPLOYEES_BY_MANAGER",
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
					return;

				case "VIEW_ALL_ROLES":
					return;

				case "CREATE_ROLE":
					createRole();
					return;

				case "REMOVE_ROLE":
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
					return;

				case "VIEW_TOTAL_UTILIZED_BUDGET_OF_DEPARTMENT":
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
					message: "Please Enter the name of new department to ADD",
				},
			])
			.then((answer) => {
				connection
					.query(`INSERT INTO departments(name) VALUES (?); `, answer.newDept)
					.then(
						db.getDepartments().then((res) => {
							console.log("\n");
							console.log(" new department added ");
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

function createRole() {
	db.getDepartments().then((departments) => {
		console.log(departments);
		// this returns whole date from departments table
		// {id:1 , name: departmentname}

		const departmentChoices = departments.map((department) => ({
			value: department.id,

			name: department.name,
		}));
		// map returns new array

		inquirer
			.prompt([
				{
					message: "what department is this role for?",
					type: "list",
					name: "department_id",
					choices: departmentChoices,
				},
			])
			.then((res) => {
				console.log(res);
				// this will return
				// {department_id: 2}
			});
	});
}
askForAction();
