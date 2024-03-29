/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
//const preprocessor =

//const { startDevServer } = require("@cypress/webpack-dev-server");
//const webpackConfig = require("../../../webpack.config");

module.exports = (on, config) => {
	//	require("@cypress/code-coverage/task")(on, config);
	//	require("@cypress/vue/dist/plugins/webpack")(on, config);
	//	on("dev-server:start", (options) =>
	//		startDevServer({ options, webpackConfig })
	//	);
	//preprocessor(on, config);
require('./seeder')(on, config);
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
	return config;
};
