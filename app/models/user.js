"use strict"

const bookshelf = require('../lib/bookshelf');

require('./car');
require('./email');

let User = bookshelf.model("User", {
	tableName: "User",
	cars: function() {
		return this.hasMany("Car", "owner");
	},
	password: function() {
		return this.hasOne("Password");
	},
	email: function() {
		return this.hasOne('Email');
	}
});

module.exports = User;

