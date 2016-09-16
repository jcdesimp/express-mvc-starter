"use strict"

const bookshelf 	= require('../lib/bookshelf');
const bcrypt 		= require('bcrypt');

require('./user');

let Car = bookshelf.model("Password", {
	tableName: "passwords"
});

module.exports = Car;

