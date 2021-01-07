const util = require("util");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
//hiding my password for mysql

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "employees_db",
});

connection.connect((err) => {
	if (err) throw err;
	console.log("mysql ok");
});

//setting up connection.query to use promises instead of callbacks
//this allows us to use the async/await syntax
connection.query = util.promisify(connection.query);

module.exports = connection;
