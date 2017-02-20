const bookshelf = require('../lib/bookshelf');

require('./user');

const Email = bookshelf.model('Email', {
  tableName: 'email',
  user() {
    return this.belongsTo('User');
  },
});

module.exports = Email;

