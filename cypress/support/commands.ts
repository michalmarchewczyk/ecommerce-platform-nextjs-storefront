Cypress.Commands.add('loginAdmin', () => {
  cy.session(
    'login',
    () => {
      cy.request('POST', `${Cypress.env('API_URL')}/auth/login`, {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      });
    },
    {
      validate() {
        cy.request('GET', `${Cypress.env('API_URL')}/users/me`)
          .its('body.email')
          .should('equal', Cypress.env('ADMIN_EMAIL'));
      },
    },
  );
});

Cypress.Commands.add('revalidatePath', (path) => {
  cy.request('GET', `/api/revalidate?path=${path}`);
});
