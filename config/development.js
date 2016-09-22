"use strict"

module.exports = {
	// development environment configuration
	database: require('../knexfile').development,
	jwt: {
		algorithm: "HS256",
		// expiresIn: "86400", 	// expire after 24 hours
		expiresIn: "3600", 		// expire after 1 hour
		
	}
}