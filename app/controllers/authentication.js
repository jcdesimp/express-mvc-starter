"use strict"

const user = require('../models/user');
const authentication = require('../lib/authentication');

const util 		= require('util');

function login(req, res, next) {
	let userDataPromise = user.where('username', req.body.username.toLowerCase()).fetch({
		require: true,
		withRelated: ["password"]
	});

	let checkPasswordPromise = userDataPromise.then(user => {
		return new Promise((accept, reject) => {
			authentication.checkPassword(req.body.password, user.related('password').attributes.password_hash, (err, success) => {
				if(err) {
					return reject(err);
				}
				return accept(success);
			});
		});
	});

	return Promise.all([userDataPromise, checkPasswordPromise])
	.then(([userData, passMatch]) => {
		if(!passMatch) {
			return res.status(400).json({
				error: "BadPassword",
				message: "Password is incorrect for user"
			});
		}
		
		let tokenData = {
			username: userData.attributes.username,
			// todo add other token data
		}

		return new Promise((accept, reject) => {
			authentication.signToken(tokenData, (err, theToken) => {
				if(err) {
					throw err;
				}
				return res.json({
					token: theToken
				});
			});
		});
	})
	.catch(err => {
		if(err.message === "EmptyResponse") {
			return res.status(400)
				.json({
					error: "NoUser",
					message: "Username not found"
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
	login
}