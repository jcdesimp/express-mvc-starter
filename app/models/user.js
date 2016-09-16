"use strict"

const bookshelf = require('../lib/bookshelf');

require('./car');

let User = bookshelf.model("User", {
	tableName: "users",
	cars: function() {
		return this.hasMany("Car", "owner");
	},
	password: function() {
		return this.belongsTo("Password")
	}
});

module.exports = User;

