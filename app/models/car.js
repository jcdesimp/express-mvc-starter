const bookshelf = require('../lib/bookshelf');

require('./user');

const Car = bookshelf.model('Car', {
  tableName: 'car',
  owner: () => this.belongsTo('User', 'owner'),
});

module.exports = Car;

