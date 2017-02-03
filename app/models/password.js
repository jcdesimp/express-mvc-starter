const bookshelf = require('../lib/bookshelf');

const Password = bookshelf.model('Password', {
  tableName: 'password',
});

module.exports = Password;

