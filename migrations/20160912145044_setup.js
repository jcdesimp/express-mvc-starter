
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('User', table => {
			table.increments('id');
			table.string('username').unique().notNullable();
			table.string('first_name');
			table.string('last_name');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.index('username');
		}),
		knex.schema.createTable('Password', table => {
			table.increments('id');
			table.integer('user_id').references('User.id').notNullable().onDelete('CASCADE');
			table.string('password_hash').notNullable();
			table.timestamp('updated_at').defaultTo(knex.fn.now());
			table.boolean('valid').defaultsTo(true);
		}),
		knex.schema.createTable('Email', table => {
			table.increments('id');
			table.integer('user_id').references('User.id').notNullable().onDelete('CASCADE');
			table.string('address').unique().notNullable();
			table.boolean('verified').defaultsTo(false);
		}),
		knex.schema.createTable('Car', table => {
			table.increments('id');
			table.string('make');
			table.string('model');
			table.integer('year');
			table.integer('owner').references('User.id');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('User'),
		knex.schema.dropTable('Password'),
		knex.schema.dropTable('Car')
	]);
};
