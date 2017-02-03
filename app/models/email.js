const bookshelf = require('../lib/bookshelf');

require('./user');

const Email = bookshelf.model('Email', {
  tableName: 'email',
  user: () => this.belongsTo('User'),
});

module.exports = Email;

