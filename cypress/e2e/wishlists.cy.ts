import { CategoryCreateDto, ProductCreateDto } from '../../lib/api';

describe('Wishlists', () => {
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

  it('creating new wishlist', () => {
    cy.visit('/');

    cy.fixture('testProducts')
      .its('0')
      .then((testProduct: ProductCreateDto) => {
        cy.contains('div', testProduct.name).parent().find('a').clickLink();
        cy.contains('button', 'Save').click();
        cy.contains('div', 'Create new wishlist').click();
        cy.contains('div', 'New wishlist name').parent().find('input').type('Test wishlist 1');
        cy.contains('div[role=dialog] button', 'Save').click();
        cy.get('div[role=dialog] button').first().click();
      });

    cy.get('header a[href="/account"]').trigger('mouseover');
    cy.get('div[role=dialog]').contains('a', 'My wishlists').click();

    cy.location('pathname').should('equal', '/account/wishlists');
    cy.contains('h2', 'My wishlists').should('exist');
    cy.contains('a', 'Test wishlist 1').click();

    cy.location('pathname').should('match', /\/account\/wishlists\/\d+/);
    cy.contains('h2', 'Test wishlist 1').should('exist');
    cy.contains('div', 'No products found').should('exist');
  });

  it('adding products to wishlist', () => {
    cy.apiPOST('/wishlists', {
      name: 'Test wishlist 2',
      productIds: [],
    });
    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.visit('/');
        cy.contains('div', testProduct.name).parent().find('a').clickLink();
        cy.contains('button', 'Save').click();
        cy.intercept('PATCH', '/wishlists/*').as('updateWishlist');
        cy.contains('button', 'Test wishlist 2').click();
        cy.wait('@updateWishlist');
      });

    cy.revalidatePath('/account/wishlists');
    cy.revalidatePath('/account/wishlists/[id]');
    cy.visit('/account/wishlists');
    cy.contains('a', 'Test wishlist 2').click();

    cy.location('pathname').should('match', /\/account\/wishlists\/\d+/);
    cy.contains('h2', 'Test wishlist 2').should('exist');
    cy.contains('div', 'No products found').should('not.exist');
    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.contains('div', testProduct.name).should('exist');
        cy.intercept('PATCH', '/wishlists/*').as('updateWishlist');
        cy.contains('div', testProduct.name).parent().parent().find('button').click();
        cy.wait('@updateWishlist');
      });
    cy.revalidatePath('/account/wishlists');
    cy.revalidatePath('/account/wishlists/[id]');
    cy.contains('div', 'No products found').should('exist');
  });
});
