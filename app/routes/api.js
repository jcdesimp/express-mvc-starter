"use strict"

const express = require('express');
let router = express.Router();


router.use('/person', require('./person'));
router.use('/car', require('./car'));


// Generate 404s
router.use((req, res, next) => {
 	let err = new Error('Not Found');
 	err.status = 404;
 	next(err);
});

// Handle errors
router.use((err, req, res, next) => {
	res.status(err.status || 500);
	(err.status === 500) ? console.log(err.stack) : null;
	res.json({
    	message: err.message,
    	error: err.stack
	});
});

module.exports = router;
