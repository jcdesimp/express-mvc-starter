"use strict"

const userController = require('../controllers/user');

const express = require('express');
let router = express.Router();

// GET all users
router.get('/', userController.getUsers);
// GET a specific user
router.get('/:id', userController.getUserById);
// CREATE a new user
router.post('/', userController.registerNewUser);
// DELETE a user
router.delete('/:id', userController.deleteUserById);

module.exports = router;