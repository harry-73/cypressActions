// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Returns a Meteor instance from the browser.
Cypress.Commands.add('getMeteor', () =>
  cy.window().then(({ Meteor }) => {
    if (!Meteor) {
      // When trying to access the `window` object before “visiting” a page in a
      // test, we get an `undefined` value. Therefore, the `Meteor` object is
      // undefined. We visit the app so that we get the Window instance of the
      // app from which we get the `Meteor` instance used in tests
    //  cy.visit('/');
      return cy.window().then(({ Meteor: MeteorSecondTry }) => MeteorSecondTry);
    }
    return Meteor;
  })
);
