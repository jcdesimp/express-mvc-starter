"use strict";
/**
 * @module controllers/user
 */

const Role = require("../models/role");


/**
 * Get all Roles in the database
 * @param  {Express.Request}   req  - the request object
 * @param  {Express.Response}  res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function getRoles(req, res) {
    return Role.fetchAll()
        .then(collection  =>  res.json(collection.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "UnknownError"
            });
        });
}

/**
 * Controller to create a new Role
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to next route handler
 */
function createRole(req, res) {
    return Role.forge(req.body)
        .save().then(role => {
            return res.json(role.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "UnknownError"
            });
        });
}

/**
 * Controller to get all users in a given role
 * @param  {Express.request}   req  - the request object
 * @param  {Express.Response}   res  - the response object
 * @param  {Function} next - pass to the next route handler
 */
function getRoleUsers(req, res) {
    return Role.forge({id: req.params.id})
    .fetch({withRelated: 'users'})
    .then(role => {
        return res.json(role.related('users'));
    });
}


module.exports = {
    getRoles,
    createRole,
    getRoleUsers
};
