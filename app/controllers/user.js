"use strict"
/**
 * @module controllers/user
 */

const User 		= require("../models/user");
const Password 	= require("../models/password");

const authentication = require('../lib/authentication');

/**
 * Controller to create a new user
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function registerNewUser(req, res, next) {

	let user_data = {};
	// validate request
	if(!req.body.hasOwnProperty("username")) {
		return res.status(400)
			.json({
				error: "MissingField",
				message: "username field is missing"
			})
	}

	if(!req.body.hasOwnProperty("password")) {
		return res.status(400)
			.json({
				error: "MissingField",
				message: "password field is missing"
			})
	}

	user_data.username 		= req.body.username.toLowerCase();
	user_data.first_name 	= req.body.first_name;
	user_data.last_name 	= req.body.first_name;

	// check that user exists
	let userExistsPromise = User.where('username', user_data.username).fetch()

	// promise for creating the user
	let createUserPromise = userExistsPromise.then( existingUser => {
			if(existingUser) {
				throw {
					error: "UsernameExists",
					message: "A user with that username already exists."
				}
			}
			return User.forge(user_data).save()
		}
	);

	// promise for hashing the password
	let passwordHashPromise = new Promise((resolve, reject) => {
		authentication.hashPassword(req.body.password, (err, hash) => {
			if(err) {
				return reject(err);
			}
			return resolve(hash);
		});
	});

	// password for storing the password
	let createPasswordPromise = Promise.all([createUserPromise, passwordHashPromise])
	.then(result => {
		return Password.forge({
			user_id: result[0].id,
			password_hash: result[1]
		}).save();
	});

	return Promise.all([createUserPromise, createPasswordPromise])
		.then(vals => {
			return res.json({
				username: vals[0].attributes.username
			});
				
			
		})
	    .catch(err => {
	    	if(err.error === "UsernameExists") {
    			return res.status(400).json(err);
	    	}
			// Unknown error
			console.error(err);
			return res.status(500)
				.json({
					error: "UnknownError"
				});
		});
		
		
}

/**
 * Get all Users in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getUsers(req, res, next) {
	return User.fetchAll()
		.then(collection  =>  res.json(collection.serialize()))
		.catch(e => console.error(e))
}


/**
 * Get a user by ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to the next route handler
 */
function getUserById(req, res, next) {
	return User.where('id', req.params.id).fetch({
			require: true,
			withRelated: req.query["withRelated"]
		})
		.then(user => res.json(user.serialize()))
		.catch(err => {
			let regMatch;
			if(regMatch = err.message.match(/([a-zA-Z]*) is not defined on the model/)) {
				return res.status(400)
					.json({
						error: "InvalidRelation",
						message: `'${regMatch[1]}' is not a valid relation on this model.`
					});
			}
			// 404
			if(err.message === "EmptyResponse") {
				return res.status(404)
					.json({
						error: "NotFound"
					});
			}
			// Unknown error
			console.error(err);
			return res.status(500)
				.json({
					error: "UnknownError"
				});
		});
}

/**
 * Delete a user by its ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Reponse}   res  - the response object
 * @param  {Function} next - pass to next handler
 */
function deleteUserById(req, res, next) {
	return User.where('id', req.params.id).fetch({
		require: true,
		withRelated: req.query["withRelated"]
	})
	.then(user => user.destroy())
	.then(result => {
		return res.status(200).send();
	})
	.catch(err => {
		if(err.message === "EmptyResponse") {
			return res.status(404)
				.json({
					error: "NotFound"
				});
		}
		// Unknown error
		console.error(err);
		return res.status(500)
		.json({
			error: "UnknownError"
		});
	});
}



module.exports = {
	getUsers,
	registerNewUser,
	getUserById,
	deleteUserById
}