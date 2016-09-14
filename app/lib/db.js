"use strict"

const config = require('../../config');

let knex = require('knex')(config.database);

module.exports = knex;