import { CategoryCreateDto, ProductCreateDto } from '../../lib/api';

describe('Cart', () => {
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

    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
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

  it('adding products to cart', () => {
    cy.visit('/');
    cy.get('header a[href="/cart"]').trigger('mouseover');
    cy.contains('div[role=dialog]', 'Your cart is empty').should('exist');
    cy.get('header a[href="/cart"]').trigger('mouseout');

    cy.fixture('testProducts')
      .invoke('slice', 0, 2)
      .each((testProduct: ProductCreateDto) => {
        cy.intercept('PUT', '/carts/my').as('cartUpdate');
        cy.contains('div', testProduct.name).parent().find('button').click({ force: true });
        cy.wait('@cartUpdate', { timeout: 20000 });
        cy.get('header a[href="/cart"]').trigger('mouseover');
        cy.contains('div[role=dialog]', 'Cart').should('contain.text', testProduct.name);
        cy.get('header a[href="/cart"]').trigger('mouseout');
      });

    cy.fixture('testProducts')
      .invoke('slice', 2, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.visit('/');
        cy.contains('div', testProduct.name).parent().find('a').clickLink();
        cy.contains('button', 'Add to cart').parent().find('input').clear();
        cy.contains('button', 'Add to cart').parent().find('input').type('2');
        cy.contains('button', 'Add to cart').click();
        cy.get('header a[href="/cart"]').trigger('mouseover');
        cy.contains('div[role=dialog]', 'Cart').should('contain.text', testProduct.name);
        cy.contains('div[role=dialog]', 'Cart').should('contain.text', '2 x');
        cy.get('header a[href="/cart"]').trigger('mouseout');
      });
  });

  it('viewing cart', () => {
    cy.apiPUT('/carts/my', {
      items: [],
    });
    cy.visit('/');
    cy.get('header a[href="/cart"]').trigger('mouseover');
    cy.contains('a', 'View cart').should('not.exist');
    cy.get('header a[href="/cart"]').trigger('mouseout');

    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto, ind: number) => {
        cy.intercept('PUT', '/carts/my').as('cartUpdate');
        cy.contains('div', testProduct.name).parent().find('button').click({ force: true });
        cy.wait('@cartUpdate');
        cy.get('header a[href="/cart"]')
          .parent()
          .should('contain.text', ind + 1);
      });

    cy.get('header a[href="/cart"]').trigger('mouseover');
    cy.contains('a', 'View cart').clickLink();

    cy.location('pathname').should('eq', '/cart');
    cy.contains('h2', 'Cart').should('exist');
    cy.contains('div', '4 items').should('exist');

    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.contains('div', testProduct.name).should('exist');
        cy.intercept('PUT', '/carts/my').as('cartUpdate');
        cy.contains('div', testProduct.name).parent().parent().find('button').last().click();
        cy.wait('@cartUpdate');
        cy.contains('div', testProduct.name).should('not.exist');
      });

    cy.contains('div', 'Your cart is empty').should('exist');
  });
});
