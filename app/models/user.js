const bookshelf = require('../lib/bookshelf');

require('./car');
require('./email');
require('./password');
require('./role');

const User = bookshelf.model('User', {
  tableName: 'user',
  cars() {
    return this.hasMany('Car', 'owner');
  },
  password() {
    return this.hasOne('Password');
  },
  email() {
    return this.hasOne('Email');
  },
  roles() {
    return this.belongsToMany('Role', 'user_role');
  },
});

module.exports = User;

