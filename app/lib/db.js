const config = require('../../config');

const knex = require('knex')(config.database);

if (config.database.client === 'sqlite3') {
  knex.raw('PRAGMA foreign_keys = ON;')
  .catch(err => console.error(err));
}

module.exports = knex;
