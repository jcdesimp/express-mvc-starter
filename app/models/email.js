"use strict"

const bookshelf = require('../lib/bookshelf');

require('./user');

let Email = bookshelf.model("Email", {
	tableName: "email",
	user: function() {
		return this.belongsTo("User");
	}
});

module.exports = Email;

