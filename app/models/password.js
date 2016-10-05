"use strict"

const bookshelf 	= require('../lib/bookshelf');

let Password = bookshelf.model("Password", {
	tableName: "password"
});

module.exports = Password;

