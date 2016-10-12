
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('user', table => {
			table.increments('id');
			table.string('username').unique().notNullable();
			table.string('first_name');
			table.string('last_name');
			table.timestamp('created_at').defaultTo(knex.fn.now());

			table.index('username');
		}),
		knex.schema.createTable('password', table => {
			table.increments('id');
			table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
			table.string('password_hash').notNullable();
			table.timestamp('updated_at').defaultTo(knex.fn.now());
			table.boolean('valid').defaultsTo(true);
		}),
		knex.schema.createTable('email', table => {
			table.increments('id');
			table.integer('user_id').references('user.id').notNullable().onDelete('CASCADE');
			table.string('address').unique().notNullable();
			table.boolean('verified').defaultsTo(false);
		}),
		knex.schema.createTable('car', table => {
			table.increments('id');
			table.string('make');
			table.string('model');
			table.integer('year');
			table.integer('owner').references('user.id');
		}),
		knex.schema.createTable('role', table => {
			table.increments('id');
			table.string('name').unique().notNullable();
		}),
		knex.schema.createTable('user_role', table => {
			table.integer('user_id').references('user.id').notNullable();
			table.integer('role_id').references('role.id').notNullable();
		})

	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('user'),
		knex.schema.dropTable('password'),
		knex.schema.dropTable('email'),
		knex.schema.dropTable('car'),
		knex.schema.dropTable('role'),
		knex.schema.dropTable('user_role')
	]);
};
