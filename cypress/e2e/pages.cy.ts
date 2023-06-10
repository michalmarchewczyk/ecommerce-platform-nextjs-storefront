import { PageCreateDto } from '../../lib/api';

describe('Pages', () => {
  beforeEach(() => {
    cy.loadFixtures(['testPages']);
  });

  before(() => {
    cy.clearTestData();
    cy.loadFixtures(['testPages']);

    cy.get('@testPages').each((testPage: PageCreateDto) => {
      cy.apiPOST('/pages', testPage).its('body.id').as('pageId');
      cy.get('@pageId').then((pageId) => {
        cy.apiPATCH(`/pages/${pageId}`, { groups: [{ name: 'info' }] });
      });
    });

    cy.revalidatePath('/');
  });

  it('listing pages', () => {
    cy.visit('/');
    cy.get<PageCreateDto[]>('@testPages').then((testPages) => {
      testPages.forEach((testPage) => {
        cy.get('footer').contains('a', testPage.title).should('exist');
      });
      cy.get('footer').contains('a', testPages[0].title).click();
      cy.location('pathname').should('equal', `/${testPages[0].slug}`);
    });
  });

  it('viewing a page', () => {
    cy.get<PageCreateDto[]>('@testPages').then((testPages) => {
      cy.visit(`/${testPages[0].slug}`);
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
      cy.get('strong').should('exist');
      cy.get('ol li').should('have.length', 3);
    });
  });
});
