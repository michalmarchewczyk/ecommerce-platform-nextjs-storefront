import { AttributeType, Category, Page, Product } from '../../lib/api';

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

Cypress.Commands.add('clearTestData', () => {
  cy.loginAdmin();
  cy.apiGET('/pages')
    .its('body')
    .each((page: Page) => {
      if (page.title.toLowerCase().includes('test')) {
        cy.apiDELETE(`/pages/${page.id}`);
      }
    });
  cy.apiGET('/categories')
    .its('body')
    .each((category: Category) => {
      if (category.name.toLowerCase().includes('test')) {
        cy.apiDELETE(`/categories/${category.id}`);
      }
    });
  cy.apiGET('/products')
    .its('body')
    .each((product: Product) => {
      if (product.name.toLowerCase().includes('test')) {
        cy.apiDELETE(`/products/${product.id}`);
      }
    });
  cy.apiGET('/attribute-types')
    .its('body')
    .each((attributeType: AttributeType) => {
      if (attributeType.name.toLowerCase().includes('test')) {
        cy.apiDELETE(`/attribute-types/${attributeType.id}`);
      }
    });
});

Cypress.Commands.add('revalidatePath', (path) => {
  cy.request('GET', `/api/revalidate?path=${path}`);
});
