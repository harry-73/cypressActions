const { defineConfig } = require('cypress');
//const vitePreprocessor = require('cypress-vite');

// tests/cypress/plugins/seeder.js

const path = require('path');

const { Seeder } = require('mongo-seeding');
const config = {
  database: 'mongodb://localhost:3001/meteor',
  dropDatabase: true
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve('./tests/cypress/data')
);

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration

  defaultCommandTimeout: 60000,
  pageLoadTimeout: 120000,
  video: true,
  fixturesFolder: 'tests/cypress/fixtures',
  //
  //pluginsFile: "tests/cypress/plugins/index.js",
  screenshotsFolder: 'tests/cypress/screenshots',
  //,
  videosFolder: 'tests/cypress/videos',
  //experimentalComponentTesting: true,

  env: {
    baseUrl: 'http://localhost:3000',
    codeCoverage: {
      url: 'http://localhost:3000/__coverage__'
    }
  },
  e2e: {
    supportFile: 'tests/cypress/support/index.js',
    specPattern: 'tests/cypress/integration/*.spec.js',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      on('task', {
        async 'seed:database'() {
          await seeder.import(collections);
          // > If you do not need to return a value, explicitly return null to
          // > signal that the given event has been handled.
          return null;
        }
      });
    //  on('file:preprocessor', vitePreprocessor());
      // on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
      // `on` is used to hook into various events Cypress emits.
      // `config` is the resolved Cypress config.
      // require('./seeder')(on, config);
      return config;
    }
  },
  component: {
    supportFile: 'tests/cypress/support/component.js',
    indexHtmlFile: 'tests/cypress/support/component-index.html',
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
});
