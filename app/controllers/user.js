/**
 * @module controllers/user
 */

const User = require('../models/user');
const Password = require('../models/password');
const Email = require('../models/email');

const authentication = require('../lib/authentication');
const bookshelf = require('../lib/bookshelf');

const has = require('has');

/**
 * Controller to create a new user
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function registerNewUser(req, res) {
  const userData = {};
  // validate request
  if (!has(req.body, 'username')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'username field is missing',
    });
  }

  if (!has(req.body, 'password')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'password field is missing',
    });
  }

  if (!has(req.body, 'email')) {
    return res.status(400)
    .json({
      error: 'MissingField',
      message: 'email field is missing',
    });
  }

  userData.username = req.body.username.toLowerCase();
  userData.first_name = req.body.first_name;
  userData.last_name = req.body.first_name;

  return bookshelf.transaction((t) => {
    // check user exists
    const userExistsPromise = User.where('username', userData.username)
    .count('id', { transacting: t })
    .tap((count) => {
      if (count !== 0) {
        throw new Error('A user with that username already exists.');
      }
    });
          // check email exists
    const emailExistsPromise = Email.where('address', req.body.email)
    .count('id', { transacting: t })
    .tap((count) => {
      if (count !== 0) {
        throw new Error('That email is already taken.');
      }
    });

    /**
     * Run in promise after the new User instance is saved
     * @param  {Object} model - the new User model
     * @return {Promise}       - a promise
     */
    function afterUserSave(model) {
      return new Promise((resolve, reject) => {
        authentication.hashPassword(req.body.password, (err, hash) => {
          if (err) {
            return reject(err);
          }
          return resolve(hash);
        });
      })
      .then(hash => // Create password model
        Password.forge({
          password_hash: hash,
        }).save({ user_id: model.id }, { transacting: t })
      )
      .then(() =>  // Create email model
        Email.forge({
          address: req.body.email,
          verified: false,
        }).save({ user_id: model.id }, { transacting: t })
      );
    }

    /**
     * Run after the user and email are checked for uniqueness
     * @return {Promise} - a promise
     */
    function afterCheckingEmailAndUser() {
      return User.forge(userData)
      .save(null, { transacting: t })
      .tap(afterUserSave);
    }

    return Promise.all([userExistsPromise, emailExistsPromise])
    .then(afterCheckingEmailAndUser);
  })
  .then(user =>
    res.json({
      id: user.id,
      username: user.username,
    })
  )
  .catch((err) => {
    // username exists
    if (err.error === 'UsernameExists') {
      return res.status(400).json(err);
    }
    // email exists
    if (err.error === 'EmailExists') {
      return res.status(400).json(err);
    }
    // Unknown error
    console.error(err);
    return res.status(500)
    .json({
      error: 'UnknownError',
    });
  });
}

/**
 * Get all Users in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getUsers(req, res) {
  return User.fetchAll()
  .then(collection => res.json(collection.serialize()))
  .catch(e => console.error(e));
}


/**
 * Get a user by ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to the next route handler
 */
function getUserById(req, res) {
  return User.where('id', req.params.id).fetch({
    require: true,
    withRelated: req.query.withRelated,
  })
            .then(user => res.json(user.serialize()))
  .catch((err) => {
    const regMatch = err.message.match(/([a-zA-Z]*) is not defined on the model/);
    if (regMatch) {
      return res.status(400)
      .json({
        error: 'InvalidRelation',
        message: `'${regMatch[1]}' is not a valid relation on this model.`,
      });
    }
    // 404
    if (err.message === 'EmptyResponse') {
      return res.status(404)
      .json({
        error: 'NotFound',
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

/**
 * Delete a user by its ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Reponse}   res  - the response object
 * @param  {Function} next - pass to next handler
 */
function deleteUserById(req, res) {
  return User.where('id', req.params.id).fetch({
    require: true,
    withRelated: req.query.withRelated,
  })
  .then(user => user.destroy())
  .then(() => res.status(200).send())
  .catch((err) => {
    if (err.message === 'EmptyResponse') {
      return res.status(404)
      .json({
        error: 'NotFound',
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

/**
 * Assign/remove roles on a user
 * @param  {Express.Request}    req  - the request object
 * @param  {Express.Reponse}    res  - the response object
 */
function setRoles(req, res) {
  const targetUser = User.forge({ id: req.params.id });
  targetUser.fetch({
    withRelated: ['roles'],
  })
  .then(user =>
    bookshelf.transaction((t) => {
      const promises = [];
      if (req.body.add) {
        promises.push(user.roles().attach(req.body.add, { transacting: t }));
      }

      if (req.body.remove) {
        promises.push(user.roles().detach(req.body.remove, { transacting: t }));
      }
      return Promise.all(promises);
    })
  )
  .then(() =>
    targetUser.fetch({
      withRelated: ['roles'],
    })
  )
  .then(user => res.status(200).send(user))
  .catch((err) => {
    console.error(err);
    return res.status(500)
    .json({
      error: 'UnknownError',
    });
  });
}


module.exports = {
  getUsers,
  registerNewUser,
  getUserById,
  deleteUserById,
  setRoles,
};
