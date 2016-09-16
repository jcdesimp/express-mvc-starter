
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', table => {
			table.increments('id');
			table.string('username').unique().notNullable();
			table.string('first_name');
			table.string('last_name');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.index('username');
		}),
		knex.schema.createTable('passwords', table => {
			table.increments('id');
			table.integer('user_id').references('users.id').notNullable().onDelete('CASCADE');
			table.string('password_hash').notNullable();
			table.timestamp('updated_at').defaultTo(knex.fn.now());
			table.boolean('valid').defaultsTo(true);
		}),
		knex.schema.createTable('cars', table => {
			table.increments('id');
			table.string('make');
			table.string('model');
			table.integer('year');
			table.integer('owner').references('users.id');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('users'),
		knex.schema.dropTable('passwords'),
		knex.schema.dropTable('cars')
	]);
};
