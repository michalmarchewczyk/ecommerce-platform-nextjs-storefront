describe('Pages', () => {
  before(() => {
    cy.fixture('testPages').then((testPages) => {
      testPages.forEach((testPage) => {
        cy.request('POST', `${Cypress.env('API_URL')}/pages`, testPage)
          .its('body.id')
          .as('pageId');
        cy.get('@pageId').then((pageId) => {
          cy.request('PATCH', `${Cypress.env('API_URL')}/pages/${pageId}`, {
            groups: [{ name: 'info' }],
          });
        });
      });
    });
    cy.visit('/');
    cy.reload(true);
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
