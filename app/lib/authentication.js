"use strict"

const bcrypt = require('bcrypt');


const NUM_SALT_ROUNDS = 10;

/**
 * Generate a salt and hash for password
 * @param  {String}   password - the plaintext password to hash
 * @param  {Function} callback - the callback
 */
function hashPassword(password, callback) {
	bcrypt.genSalt(NUM_SALT_ROUNDS, (err, salt) => {
		if(err) {
			return callback(err);
		}
		bcrypt.hash(password, salt, (err, hash) => {
			if(err) {
				return callback(err);
			}
			return callback(null, hash);
		});
	});
}

/**
 * Check a password against it's hash
 * @param  {String} given - the given plantext password
 * @param  {String} hash  - the stored hash
 */
function checkPassword(given, hash, callback) {
	bcrypt.compare(given, hash, (err, res) => {
	    if(err) {
	    	return callback(err);
	    }
	    return callback(null, res);
	});
}



module.exports = {
	hashPassword,
	checkPassword
}

