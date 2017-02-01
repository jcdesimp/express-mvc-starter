"use strict";
/**
 * @module controllers/user
 */

const Car = require("../models/car");


/**
 * Get all People in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getCars(req, res) {
    return Car.fetchAll()
        .then(collection  =>  res.json(collection.serialize()))
        .catch(e => console.error(e));
}

/**
 * Controller to create a new Car
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function createCar(req, res) {
    return Car.forge(req.body)
        .save().then(car => {
            return res.json(car.serialize());
        });
}

/**
 * Get a Car by its ID
 * @param  {Express.Request}   req  - the request object
 * @param  {Ecpress.Response}   res  - the response object
 * @param  {Function} next - pass to nect error handler
 */
function getCarById(req, res, next) {
    return Car.where('id', req.params.id).fetch({
        require: true,
        withRelated: req.query["withRelated"],
        columns: req.query["includeFields"]
    })
    .then(car => res.json(car.serialize()))
    .catch(err => {
        let regMatch = err.message.match(/([a-zA-Z]*) is not defined on the model/);
        if(regMatch) {
            return res.status(400)
                .json({
                    error: "InvalidRelation",
                    message: `'${regMatch[1]}' is not a valid relation on this model.`
                });
        }
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
    createCar,
    getCars,
    getCarById
};
