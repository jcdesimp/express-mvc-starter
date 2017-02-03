const knexfile = require('../knexfile');

module.exports = {
  // development environment configuration
  database: knexfile.development,
  jwt: {
    algorithm: 'RS256',
    expiresIn: '1800000', // expire after 1 minute
  },
};
