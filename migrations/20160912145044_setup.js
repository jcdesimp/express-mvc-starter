
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('people', table => {
			table.increments('id');
			table.string('first_name');
			table.string('last_name');
		}),
		knex.schema.createTable('cars', table => {
			table.increments('id');
			table.string('make');
			table.string('model');
			table.integer('year');
			table.integer('owner').references('people.id');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('people'),
		knex.schema.dropTable('cars')
	]);
};
