"use strict"
/**
 * @module controllers/user
 */

const User 		= require("../models/user");
const Password 	= require("../models/password");
const Email 	= require("../models/email");

const authentication 	= require('../lib/authentication');
const bookshelf 		= require('../lib/bookshelf');

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
			});
	}

	if(!req.body.hasOwnProperty("password")) {
		return res.status(400)
			.json({
				error: "MissingField",
				message: "password field is missing"
			});
	}

	if(!req.body.hasOwnProperty("email")) {
		return res.status(400)
			.json({
				error: "MissingField",
				message: "email field is missing"
			});
	}

	user_data.username 		= req.body.username.toLowerCase();
	user_data.first_name 	= req.body.first_name;
	user_data.last_name 	= req.body.first_name;

	bookshelf.transaction(t => {
		// check user exists
		let userExistsPromise = User.where('username', user_data.username)
		.count('id', {transacting: t})
		.tap(count => {
			if(count != 0) {
				throw {
					error: "UsernameExists",
					message: "A user with that username already exists."
				}
			}
			return
		});
		// check email exists
		let emailExistsPromise = Email.where('address', req.body.email)
		.count('id', {transacting: t})
		.tap(count => {
			if(count != 0) {
				throw {
					error: "EmailExists",
					message: "That email is already taken."
				}
			}
			return
		});
		
		return Promise.all([userExistsPromise, emailExistsPromise])
		.then(() => {
			return User.forge(user_data)
			.save(null, {transacting: t})
			.tap(model => {
				return new Promise((resolve, reject) => {
					authentication.hashPassword(req.body.password, (err, hash) => {
						if(err) {
							return reject(err);
						}
						return resolve(hash);
					});
				}).then(hash => {
					return Password.forge({
						password_hash: hash
					}).save({user_id: model.id}, {transacting: t});
				}).then(passModel => {
					return Email.forge({
						address: req.body.email,
						verified: false
					}).save({user_id: model.id}, {transacting: t});
				});
			});
		});
	}).then(user => {
		return res.json({
			id: user.id,
			username: user.username
		});
	}).catch(err => {
		// username exists
    	if(err.error === "UsernameExists") {
			return res.status(400).json(err);
    	}
		// email exists
    	if(err.error === "EmailExists") {
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

/**
 * Assign/remove roles on a user
 * @param  {Express.Request}   	req  - the request object
 * @param  {Express.Reponse}   	res  - the response object
 * @param  {Function} 			next - pass to next handler
 */
function setRoles(req, res, next) {
	let target_user = User.forge({id: req.params.id})
	target_user.fetch({
		withRelated: ["roles"]
	})
	.then(user => {
		return bookshelf.transaction(t => {
			let promises = [];
			req.body.add ? promises.push(user.roles().attach(req.body.add, {transacting: t})) : null;
			req.body.remove ? promises.push(user.roles().detach(req.body.remove, {transacting: t})) : null;
			return Promise.all(promises);
		});
	}).then(result => {
		return target_user.fetch({
			withRelated: ["roles"]
		})
	})
	.then(user => {
		return res.status(200).send(user);
	}).catch(err => {
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
	deleteUserById,
	setRoles
}