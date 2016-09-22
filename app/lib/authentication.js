"use strict"

const bcrypt 	= require('bcrypt');
const fs 		= require('fs');
const jwt 		= require('jsonwebtoken');
const config 	= require('../../config');


const NUM_SALT_ROUNDS 			= 10;
const JWT_PRIVATE_CERT_FILE 	= "./resources/privkey.pem";
const JWT_PUBLIC_CERT_FILE 		= "./resources/pubkey.pem";

let privateCert = fs.readFileSync(JWT_PRIVATE_CERT_FILE);
let publicCert 	= fs.readFileSync(JWT_PUBLIC_CERT_FILE);

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


function signToken(tokenData, callback) {
	jwt.sign(tokenData, privateCert, config.jwt, callback);
}


function verifyToken(token, callback) {
	jwt.verify(token, publicCert, callback);
}


module.exports = {
	hashPassword,
	checkPassword,
	signToken,
	verifyToken
}

