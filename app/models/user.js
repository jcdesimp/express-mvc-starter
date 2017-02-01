"use strict";

const bookshelf = require('../lib/bookshelf');

require('./car');
require('./email');
require('./password');
require('./role');

let User = bookshelf.model("User", {
	tableName: "user",
	cars: function() {
		return this.hasMany("Car", "owner");
	},
	password: function() {
		return this.hasOne("Password");
	},
	email: function() {
		return this.hasOne('Email');
	},
	roles: function() {
		return this.belongsToMany("Role", "user_role")
	}
});

module.exports = User;

