"use strict"

const bookshelf = require('../lib/bookshelf');

require('./person');

let Car = bookshelf.model("Car", {
	tableName: "cars",
	owner: function() {
		return this.belongsTo("Person", "owner");
	}
});

module.exports = Car;

