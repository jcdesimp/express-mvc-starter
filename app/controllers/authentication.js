const user = require('../models/user');
const authentication = require('../lib/authentication');


/**
 * Verify password and generate a JWT for a user
 * @param  {Express.Request}   req  - the request
 * @param  {Express.Resonse}   res  - the response
 * @param  {Function} next - pass to next route handler
 */
function login(req, res) {
  const userDataPromise = user.where('username', req.body.username.toLowerCase()).fetch({
    require: true,
    withRelated: ['password'],
  });

  const checkPasswordPromise = userDataPromise.then(() =>
    new Promise((accept, reject) => {
      authentication.checkPassword(req.body.password, user.related('password').attributes.password_hash, (err, success) => {
        if (err) {
          return reject(err);
        }
        return accept(success);
      });
    })
  );

  return Promise.all([userDataPromise, checkPasswordPromise])
  .then(([userData, passMatch]) => {
    if (!passMatch) {
      return res.status(400).json({
        error: 'BadPassword',
        message: 'Password is incorrect for user',
      });
    }

    const tokenData = {
      username: userData.attributes.username,
      // todo add other token data
    };

    return new Promise((accept, reject) => {
      authentication.signToken(tokenData, (err, theToken) => {
        if (err) {
          reject(err);
        }
        return res.json({
          token: theToken,
        });
      });
    });
  })
  .catch((err) => {
    if (err.message === 'EmptyResponse') {
      return res.status(400)
      .json({
        error: 'NoUser',
        message: 'Username not found',
      });
    }
        // Unknown error
    console.error(err);
    return res.status(500)
    .json({
      error: 'UnknownError',
    });
  });
}


module.exports = {
  login,
};
