import './commands';

beforeEach(() => {
  cy.session(
    'login',
    () => {
      cy.request('POST', 'http://localhost/auth/login', {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      });
    },
    {
      validate() {
        cy.request('GET', 'http://localhost/users/me')
          .its('body.email')
          .should('equal', Cypress.env('ADMIN_EMAIL'));
      },
    },
  );
});
