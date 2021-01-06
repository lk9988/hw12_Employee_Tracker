const connection = require("./connection");

module.exports = {
	getDepartments() {
		return connection.query(
			"SELECT * FROM departments",
			function (err, res) {}
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
