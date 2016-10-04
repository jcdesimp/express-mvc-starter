"use strict"

const bookshelf = require('../lib/bookshelf');

require('./user');

let Car = bookshelf.model("Car", {
	tableName: "Car",
	owner: function() {
		return this.belongsTo("User", "owner");
	}
});

module.exports = Car;

