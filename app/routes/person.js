"use strict"

const personController = require('../controllers/person');

const express = require('express');
let router = express.Router();

// GET all people
router.get('/', personController.getPeople);
// GET a specific person
router.get('/:id', personController.getPersonById);
// CREATE a new person
router.post('/', personController.createPerson);

module.exports = router;