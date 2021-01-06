const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "firenze098",
	database: "employees",
});

connection.connect((err) => {
	if (err) throw err;
	console.log("mysql ok");
});

//setting up connection.query to use promises instead of callbacks
//this allows us to use the async/await syntax
connection.query = util.promisify(connection.query);

module.exports = connection;
