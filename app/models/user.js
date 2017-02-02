const bookshelf = require('../lib/bookshelf');

require('./car');
require('./email');
require('./password');
require('./role');

const User = bookshelf.model('User', {
  tableName: 'user',
  cars: () => this.hasMany('Car', 'owner'),
  password: () => this.hasOne('Password'),
  email: () => this.hasOne('Email'),
  roles: () => this.belongsToMany('Role', 'user_role'),
});

module.exports = User;

