"use strict"
/**
 * @module controllers/person
 */

const Person = require("../models/person");

/**
 * Get all People in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getPeople(req, res, next) {
	return Person.fetchAll()
		.then(collection  =>  res.json(collection.serialize()))
		.catch(e => console.log(e))
}

/**
 * Controller to create a new Person
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function createPerson(req, res, next) {
	return Person.forge(req.body)
		.save().then(person => {
			return res.json(person.serialize());
		});
}

/**
 * Get a person by ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to the next route handler
 */
function getPersonById(req, res, next) {
	return Person.where('id', req.params.id).fetch({
			require: true,
			withRelated: req.query["withRelated"]
		})
		.then(person => res.json(person.serialize()))
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
			console.log(err);
			return res.status(500)
				.json({
					error: "UnknownError"
				});
		});
}


module.exports = {
	getPeople,
	createPerson,
	getPersonById
}