import './commands';

before(() => {
  cy.loginAdmin();
});

beforeEach(() => {
  cy.loginAdmin();
});
