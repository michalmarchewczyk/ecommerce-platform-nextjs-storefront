import { CategoryCreateDto, ProductCreateDto } from '../../lib/api';

describe('Products', () => {
  before(() => {
    cy.clearTestData();

    cy.fixture('testFeaturedCategory').then((testFeaturedCategory: CategoryCreateDto) => {
      cy.apiPOST('/categories', testFeaturedCategory).its('body.id').as('categoryId');
      cy.get<string>('@categoryId').then((categoryId) => {
        cy.apiPATCH(`/categories/${categoryId}`, {
          groups: [{ name: 'featured' }],
        });
      });
    });

    cy.fixture('testProducts').each((testProduct: ProductCreateDto) => {
      cy.apiPOST('/products', testProduct).its('body.id').as('productId');
      cy.get<string>('@categoryId').then((categoryId) => {
        cy.get<string>('@productId').then((productId) => {
          cy.apiPOST(`/categories/${categoryId}/products`, {
            productId,
          });
        });
      });
    });

    cy.revalidatePath('/');
  });

  it('viewing category with products', () => {
    cy.visit('/');
    cy.fixture('testFeaturedCategory').then((testFeaturedCategory: CategoryCreateDto) => {
      cy.contains('section', testFeaturedCategory.name).should('exist');
      cy.contains('section', testFeaturedCategory.name).contains('a', 'View All Products').click();
      cy.location('pathname').should('match', /\/categories\/.+/);
      cy.contains('h2', testFeaturedCategory.name).should('exist');
      cy.contains('div', 'Showing 1 - 12 (12) of 20 products').should('exist');
    });
  });

  it('sorting products', () => {
    cy.visit('/');
    cy.fixture('testFeaturedCategory').then((testFeaturedCategory: CategoryCreateDto) => {
      cy.contains('section', testFeaturedCategory.name).contains('a', 'View All Products').click();
    });
    cy.fixture('testProducts').then((testProducts: ProductCreateDto[]) => {
      const cheapestProduct = testProducts.sort((a, b) => a.price - b.price)[0];
      cy.contains('div', 'Test product').parent().should('contain', cheapestProduct.name);
    });

    cy.contains('button', 'Price: low to high').click();
    cy.contains('button', 'Price: high to low').click();
    cy.location('search').should('equal', '?sort=price-desc');
    cy.fixture('testProducts').then((testProducts: ProductCreateDto[]) => {
      const mostExpensiveProduct = testProducts.sort((a, b) => b.price - a.price)[0];
      cy.contains('div', 'Test product').parent().should('contain', mostExpensiveProduct.name);
    });

    cy.contains('button', '2').click();
    cy.location('search').should('equal', '?sort=price-desc&page=2');
    cy.contains('div', 'Showing 13 - 20 (8) of 20 products').should('exist');
    cy.fixture('testProducts').then((testProducts: ProductCreateDto[]) => {
      const cheapestProduct = testProducts.sort((a, b) => a.price - b.price)[0];
      cy.contains('div', 'Test product')
        .parent()
        .parent()
        .parent()
        .find('> div')
        .last()
        .should('contain', cheapestProduct.name);
    });
  });

  it('viewing product', () => {
    cy.visit('/');
    cy.fixture('testFeaturedCategory').then((testFeaturedCategory: CategoryCreateDto) => {
      cy.contains('section', testFeaturedCategory.name).contains('a', 'View All Products').click({ force: true });
    });
    cy.location('pathname').should('match', /\/categories\/.+/);
    cy.contains('div', 'Test product').parent().find('a').clickLink();

    cy.location('pathname').should('match', /\/products\/.+/);
    cy.fixture('testProducts').then((testProducts: ProductCreateDto[]) => {
      const cheapestProduct = testProducts.sort((a, b) => a.price - b.price)[0];
      cy.contains('h3', cheapestProduct.name).should('exist');
      cy.contains('div', cheapestProduct.description).should('exist');
      cy.contains('div', `${cheapestProduct.stock} in stock`).should('exist');
    });
  });
});
