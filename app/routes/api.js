const express = require('express');

const router = express.Router();

const authenticationController = require('../controllers/authentication');

router.use('/user', require('./user'));
router.use('/car', require('./car'));
router.use('/role', require('./role'));

router.post('/login', authenticationController.login);

// Generate 404s
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle errors
router.use((err, req, res) => {
  res.status(err.status || 500);
  if (err.status === 500) {
    console.log(err.stack);
  }
  res.json({
    message: err.message,
    error: err.stack,
  });
});

module.exports = router;
