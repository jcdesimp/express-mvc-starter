const userController = require('../controllers/user');
const authenticationMiddleware = require('../middleware/authentication');
const express = require('express');

const router = express.Router();

// GET all users
router.get(
  '/',  // route
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUsers,  // the controller
);
// GET a specific user
router.get(
  '/:id',
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.getUserById,
);
// CREATE a new user
router.post('/', userController.registerNewUser);
// DELETE a user
router.delete(
  '/:id',
  authenticationMiddleware.validateAuthentication,  // isAuthenticated middleware
  userController.deleteUserById,
);
router.patch(
  '/:id/roles',
  authenticationMiddleware.validateAuthentication,
  userController.setRoles,
);

module.exports = router;
