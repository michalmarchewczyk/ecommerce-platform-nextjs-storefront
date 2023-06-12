import { CategoryCreateDto } from '../../lib/api';

type CategoryCreateDtoWithChildren = CategoryCreateDto & {
  children?: CategoryCreateDtoWithChildren[];
};

const createCategory = (category: CategoryCreateDtoWithChildren, parentId?: string) => {
  cy.apiPOST('/categories', category).its('body.id').as('categoryId');
  cy.get<string>('@categoryId').then((categoryId) => {
    cy.apiPATCH(`/categories/${categoryId}`, {
      ...(!parentId && { groups: [{ name: 'main' }] }),
      ...(parentId && { parentCategoryId: parentId }),
    });
    category.children?.forEach((childCategory) => {
      createCategory(childCategory, categoryId);
    });
  });
};

describe('Categories', () => {
  beforeEach(() => {
    cy.loadFixtures(['testCategories']);
  });

  before(() => {
    cy.clearTestData();
    cy.loadFixtures(['testCategories']);

    cy.get('@testCategories').each((testCategory: CategoryCreateDtoWithChildren) => {
      createCategory(testCategory);
    });

    cy.revalidatePath('/');
  });

  it('viewing header categories', () => {
    cy.visit('/');
    cy.get<CategoryCreateDtoWithChildren[]>('@testCategories').then((testCategories) => {
      testCategories.forEach((testCategory) => {
        cy.get('header').contains('a', testCategory.name).should('exist');
      });
      cy.get('header').contains('a', testCategories[0].name).trigger('mouseover');
      cy.contains('div[role=dialog]', testCategories[0].name).should('exist');
      testCategories[0].children.forEach((childCategory) => {
        cy.contains('div[role=dialog]', childCategory.name).should('exist');
      });
      cy.contains('div[role=dialog] a', 'View products').click({ force: true });
      cy.location('pathname').should('match', /\/categories\/.+/);
    });
  });

  it('navigating categories', () => {
    cy.get<CategoryCreateDtoWithChildren[]>('@testCategories').then((testCategories) => {
      cy.visit('/');
      cy.get('header').contains('a', testCategories[0].name).clickLink();

      cy.location('pathname').should('match', /\/categories\/.+/);
      cy.contains('h2', testCategories[0].name).should('exist');
      cy.contains('ul > li span', testCategories[0].name).should('exist');
      testCategories[0].children.forEach((childCategory) => {
        cy.contains('ul > li a', childCategory.name).should('exist');
      });
      cy.contains('ul > li a', testCategories[0].children[0].name).click({
        force: true,
      });

      cy.location('pathname').should('match', /\/categories\/.+/);
      cy.contains('h2', testCategories[0].children[0].name).should('exist');
      cy.contains('ul > li span', testCategories[0].children[0].name).should('exist');
      testCategories[0].children[0].children.forEach((childCategory) => {
        cy.contains('ul > li a', childCategory.name).should('exist');
      });
      cy.contains('a', testCategories[0].name).should('exist');
      cy.contains('a', testCategories[0].name).click({ force: true });
      cy.contains('h2', testCategories[0].name).should('exist');
    });
  });
});
