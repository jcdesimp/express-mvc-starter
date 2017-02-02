
const carController = require('../controllers/car');
const express = require('express');

const router = express.Router();

// GET a person
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.post('/', carController.createCar);

module.exports = router;
