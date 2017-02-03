Express Starter Kit
=======
Starter kit repo for a RESTful NodeJS/Express application.

Overview
----
The purpose of this repo if to eliminate much of the tyical boilerplate/scoffolding that is invloved when starting a brand new Express RESTful backend.

It includes testing utilities via Mocha, test coverage via Istanbul, an ORM via Bookshelf and Knex and many other features that normally require a lot of repetitive configuration.

Usage
----
When you first clone this repo there are a few things you'll need to do to get started.

It is assumed that you have NodeJS v6.0+ installed and npm.

First is to run `npm install` to install project dependencies.

You should now be able to run `npm start` and start the project locally. However, you don't have a database yet.

The default development databsae uses SQLite. The app uses knex as a query bulider which also manages migrations. It also uses Bookshelf as an ORM.

Migrations are written in the `migrations/` directory. These migrations can be run with `npm run migrate`.

Once this is done you should now have a `databse.sqlite3` file in your project root. This is your project's development database.

The default project also expects there to be a `privkey.pem` and `pubkey.pem` in the resources folder. These files make up the public/private keypair used to sign and validate the JSON Web Tokens used in authenticating requests.

You can easily generate these files by running an included script `node ./scripts/generate_jwt_keys.js`. (all this script does is make system calls to openssl, so you'll need that installed.)

Project Structure
----
There are numbers subdirectories within the start kit application structure.

- app/
    - this contains all the application logic. That is the Models and controllers (and any EJS views) are all defined here. As well as any reusable utility code. (in the "lib" folder"
    - controllers/
        - the controllers are all defined within here. Each controller is defined with a file that classifies it within a domain. Usually these domains can be associated with one of the models. For example all "car" controllers have to do with CRUD actions on Car models.
    - models/
        - This is where the Models are defined. Models are defined using the "Bookshelf" ORM. You may also want to look at the Knex documentation when researching Bookshelf models. Knex is the query builder that powers Bookshelf.
    - lib/
        - the "lib" directory contains code snippets that are used in multiple locations within the application. Behavior that doesnt fall within Model, View, or Controller logic goes here. For example the "Bookshelf" instantiations are done here. This is also a good place to put simple 3rd party API adaptors that aren't sophisticated enough to warrent their own NPM module.
    -  middleware/
        - This directory contains "middleware" functions. This involves logic that is used between request routing and controller. For example the "validateAuthentication" middleware in the "authentication" file here serves to verify that the request contains a valid JWT token for authentication.
    - routes/
        - the "routes" folder contians the various application routes. The "api.js" file defines all the root level routes that lead to the more domain specific routers. (Typically related to models). For example the "/car" route here passes control to the car router within the "car.js: file. Within the "car.js" file you can see the various sub-routes that map to the various controllers within "controllers/car.js".
    - services/
	    - Any application service code (data imports, email sending, etc.) should go here.
    - views/
        - The express configuration in this repo also includes support for EJS (Embedded javaScript) templates. Although this is primarilly a data-only JSON RESTful API, it can still be useful to render full pages for development and administration purposes. Currently there are very basic examples in this directory.
    - index.js
    	- This file contains all the logic for the application level bootstrapping and configuration. If you've worked with a typical expess app before, often times this logic is in a top-level file named "app.js".
- bin/
    - www
        - This file contains the server logic for the application.
- config/
   - This directory contiains application configuration files for various environments.
   - index.js
       - this file loads all the other environment specific configurations within this directory. Dynamically loading the correct one based on the NODE_ENV environment variable.
   - development.js
       - contains configration options for development environments. Currently this is the only environment that is defined.
- migrations/
	- This contains all the knex migrations. When changes are made to the database schema new migrations must be created. To run these migrations you can run `npm run exec knex migrate:latest`. This will update your database to the latest migrations.
- public/
    - all static files will be served from this directory. This includes Javascript, Css, and any other staic assets like images. This directory is relative to the web root when clients are loading it.
- resources/
    - Miscellaneous files are kept here. Currently the public/private keypair for generating JWT (Json Web Tokens) are stored here. These can be generated with the "gen_jwt_keys.js" script in the scripts folder.
- scripts/
    - This file contains helful scripts to perform tasks more easily. Currently the only script here, `gen_jwt_keys.js`, can generate the public/private RSA keypairs into the "resources" folder.
- seeds/
   - Knex seed data goes here for seeding a fresh database. There is a very simple example here right now Check the knexJS documentation for how to seed data.
- test/
  - Mocha test files will go here. Currently there are no test files.
- .gitignore
	- The gitignore file which tells Git which files not to include in the repository and ignore in commits.
- jsdoc.json
	- Configuration file for generating JSDoc browsable documantation.
- knexfile.js
	- Contains database configration options for different databases in various environments. Currently development, staging, and production examples are there.
- package.json
	- Configuration file continedin most NodeJS projects. Contains dependencies and various NPM task definitions.