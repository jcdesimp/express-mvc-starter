const bookshelf = require('../lib/bookshelf');

require('./user');

const Role = bookshelf.model('Role', {
  tableName: 'role',
  users: () => this.belongsToMany('User', 'user_role'),
});

module.exports = Role;

