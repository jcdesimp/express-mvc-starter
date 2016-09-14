"use strict"

const bookshelf = require('../lib/bookshelf');

require('./car');

let Person = bookshelf.model("Person", {
	tableName: "people",
	cars: function() {
		return this.hasMany("Car", "owner");
	}
});

module.exports = Person;

