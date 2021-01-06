const inquirer = require("inquirer");
const { createBrotliDecompress } = require("zlib");
const db = require("./main/db");
const connection = require("./main/db/connection");

function askForAction() {
	inquirer
		.prompt({
			message: "choose something to do",
			name: "action",
			type: "list",
			choices: [
				"VIEW_DEPARTMENTS",
				"view roles",
				"view employees",
				"CREATE_ROLE",
				"QUIT",
			],
		})
		.then((res) => {
			switch (res.action) {
				case "VIEW_DEPARTMENTS":
					return;

				case "view roles":
					return;

				case "view employees":
					return;

				case "CREATE_ROLE":
					createRole();
					return;

				default:
					connection.end();
			}
		});
}

function viewDepartment() {
	db.getDepartments()
		// only works because of util.promisify
		// also db.index.js file, must return connection.query
		// otherwise, .then change will not work
		.then((results) => {
			console.log(results);
			askForAction();
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
