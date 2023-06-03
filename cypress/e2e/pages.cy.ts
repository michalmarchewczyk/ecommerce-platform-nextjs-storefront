import { Page, PageCreateDto } from '../../lib/api';

describe('Pages', () => {
  before(() => {
    cy.request(`${Cypress.env('API_URL')}/pages`)
      .its('body')
      .each((page: Page) => {
        if (page.title.toLowerCase().includes('test')) {
          cy.request('DELETE', `${Cypress.env('API_URL')}/pages/${page.id}`);
        }
      });

    cy.fixture('testPages').each((testPage: PageCreateDto) => {
      cy.request('POST', `${Cypress.env('API_URL')}/pages`, testPage)
        .its('body.id')
        .as('pageId');
      cy.get('@pageId').then((pageId) => {
        cy.request('PATCH', `${Cypress.env('API_URL')}/pages/${pageId}`, {
          groups: [{ name: 'info' }],
        });
      });
    });

    cy.revalidatePath('/');
  });

  it('listing pages', () => {
    cy.visit('/');
    cy.fixture('testPages').then((testPages) => {
      testPages.forEach((testPage) => {
        cy.get('footer').contains('a', testPage.title).should('exist');
      });
      cy.get('footer').contains('a', testPages[0].title).click();
      cy.location('pathname').should('equal', `/${testPages[0].slug}`);
    });
  });

  it('viewing a page', () => {
    cy.fixture('testPages').then((testPages) => {
      cy.visit(`/${testPages[0].slug}`);
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
      cy.get('strong').should('exist');
      cy.get('ol li').should('have.length', 3);
    });
  });
});
