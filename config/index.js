// Use production config in production mode, development config otherwise
module.exports = (process.env.NODE_ENV === 'production') ?
  // TODO: Create production configuration file
  // require('./production') :
  {} :
  require('./development');
