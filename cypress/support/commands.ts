Cypress.Commands.add('apiGET', (path) => {
  return cy.request('GET', `${Cypress.env('API_URL')}${path}`);
});

Cypress.Commands.add('apiPOST', (path, body) => {
  return cy.request('POST', `${Cypress.env('API_URL')}${path}`, body);
});

Cypress.Commands.add('apiPATCH', (path, body) => {
  return cy.request('PATCH', `${Cypress.env('API_URL')}${path}`, body);
});

Cypress.Commands.add('apiPUT', (path, body) => {
  return cy.request('PUT', `${Cypress.env('API_URL')}${path}`, body);
});

Cypress.Commands.add('apiDELETE', (path) => {
  return cy.request('DELETE', `${Cypress.env('API_URL')}${path}`);
});

Cypress.Commands.add('loginAdmin', () => {
  cy.session(
    'login',
    () => {
      cy.apiPOST('/auth/login', {
        email: Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      });
    },
    {
      validate() {
        cy.apiGET('/users/me').its('body.email').should('equal', Cypress.env('ADMIN_EMAIL'));
      },
    },
  );
});

Cypress.Commands.add('revalidatePath', (path) => {
  cy.request('GET', `/api/revalidate?path=${path}`);
});
