import { Category, CategoryCreateDto } from '../../lib/api';

describe('Categories', () => {
  before(() => {
    cy.request(`${Cypress.env('API_URL')}/categories`)
      .its('body')
      .each((category: Category) => {
        if (category.name.toLowerCase().includes('test')) {
          cy.request(
            'DELETE',
            `${Cypress.env('API_URL')}/categories/${category.id}`,
          );
        }
      });

    type CategoryCreateDtoWithChildren = CategoryCreateDto & {
      children?: CategoryCreateDtoWithChildren[];
    };

    const createCategory = (
      category: CategoryCreateDtoWithChildren,
      parentId?: string,
    ) => {
      cy.request('POST', `${Cypress.env('API_URL')}/categories`, category)
        .its('body.id')
        .as('categoryId');
      cy.get<string>('@categoryId').then((categoryId) => {
        cy.request(
          'PATCH',
          `${Cypress.env('API_URL')}/categories/${categoryId}`,
          {
            ...(!parentId && {
              groups: [{ name: 'main' }, { name: 'featured' }],
            }),
            ...(parentId && { parentCategoryId: parentId }),
          },
        );
        category.children?.forEach((childCategory) => {
          createCategory(childCategory, categoryId);
        });
      });
    };

    cy.fixture('testCategories').then((testCategories) => {
      testCategories.forEach((testCategory: CategoryCreateDtoWithChildren) => {
        createCategory(testCategory);
      });
    });

    cy.revalidatePath('/');
  });

  it('viewing header categories', () => {
    cy.visit('/');
    cy.fixture('testCategories').then((testCategories) => {
      testCategories.forEach((testCategory) => {
        cy.get('header').contains('a', testCategory.name).should('exist');
      });
      cy.get('header')
        .contains('a', testCategories[0].name)
        .trigger('mouseover');
      cy.contains('div[role=dialog]', testCategories[0].name).should('exist');
      testCategories[0].children.forEach((childCategory) => {
        cy.contains('div[role=dialog]', childCategory.name).should('exist');
      });
      cy.contains('div[role=dialog] a', 'View products').click({ force: true });
      cy.location('pathname', { timeout: 10000 }).should(
        'match',
        /\/categories\/.+/,
      );
    });
  });

  it('navigating categories', () => {
    cy.fixture('testCategories').then((testCategories) => {
      cy.visit('/');
      cy.get('header').contains('a', testCategories[0].name).click();

      cy.location('pathname', { timeout: 10000 }).should(
        'match',
        /\/categories\/.+/,
      );
      cy.contains('h2', testCategories[0].name).should('exist');
      cy.contains('ul > li span', testCategories[0].name).should('exist');
      testCategories[0].children.forEach((childCategory) => {
        cy.contains('ul > li a', childCategory.name).should('exist');
      });
      cy.contains('ul > li a', testCategories[0].children[0].name).click({
        force: true,
      });

      cy.location('pathname', { timeout: 10000 }).should(
        'match',
        /\/categories\/.+/,
      );
      cy.contains('h2', testCategories[0].children[0].name).should('exist');
      cy.contains('ul > li span', testCategories[0].children[0].name).should(
        'exist',
      );
      testCategories[0].children[0].children.forEach((childCategory) => {
        cy.contains('ul > li a', childCategory.name).should('exist');
      });
      cy.contains('a', testCategories[0].name).should('exist');
      cy.contains('a', testCategories[0].name).click({ force: true });
      cy.contains('h2', testCategories[0].name).should('exist');
    });
  });
});
