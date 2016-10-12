"use strict"

const roleController = require('../controllers/role');

const express = require('express');
let router = express.Router();

// GET a person
router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.get('/:id/users', roleController.getRoleUsers);

module.exports = router;