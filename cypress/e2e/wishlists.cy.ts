import { CategoryCreateDto, ProductCreateDto } from '../../lib/api';

describe('Wishlists', () => {
  beforeEach(() => {
    cy.loadFixtures(['testProducts', 'testFeaturedCategory']);
  });

  before(() => {
    cy.clearTestData();
    cy.loadFixtures(['testProducts', 'testFeaturedCategory']);

    cy.get<CategoryCreateDto>('@testFeaturedCategory').then((testFeaturedCategory) => {
      cy.apiPOST('/categories', testFeaturedCategory).its('body.id').as('categoryId');
    });
    cy.get<string>('@categoryId').then((categoryId) => {
      cy.apiPATCH(`/categories/${categoryId}`, { groups: [{ name: 'featured' }] });
    });

    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.apiPOST('/products', testProduct).its('body.id').as('productId');
        cy.getAliases(['productId', 'categoryId']).then(([productId, categoryId]) => {
          cy.apiPOST(`/categories/${categoryId}/products`, { productId });
        });
      });

    cy.revalidatePath('/');
  });

  it('creating new wishlist', () => {
    cy.visit('/');

    cy.get('@testProducts')
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
    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.visit('/');
        cy.contains('div', testProduct.name).parent().find('a').clickLink();
        cy.contains('button', 'Save').click();
        cy.contains('button', 'Test wishlist 2').click();
      });

    cy.visit('/account/wishlists');
    cy.contains('a', 'Test wishlist 2').click();

    cy.location('pathname').should('match', /\/account\/wishlists\/\d+/);
    cy.contains('h2', 'Test wishlist 2').should('exist');
    cy.contains('div', 'No products found').should('not.exist');
    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.contains('div', testProduct.name).should('exist');
        cy.contains('div', testProduct.name).parent().parent().find('button').clickLink();
        cy.revalidatePath('/account/wishlists/');
        cy.revalidatePath('/account/wishlists/[id]');
        cy.reload();
        cy.contains('div', testProduct.name).should('not.exist');
      });
    cy.contains('div', 'No products found').should('exist');
  });
});
