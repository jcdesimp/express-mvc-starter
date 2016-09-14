"use strict"
// Use production config in production mode, development config otherwise
module.exports = (process.env.NODE_ENV === "production") ?
	require("./production") :
	require("./development");