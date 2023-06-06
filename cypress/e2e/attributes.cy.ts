import { CategoryCreateDto, ProductCreateDto, AttributeTypeDto } from '../../lib/api';

describe('Attributes', () => {
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

    const attributeTypeIds: string[] = [];
    cy.fixture('testAttributes').each((testAttribute: AttributeTypeDto) => {
      cy.apiPOST('/attribute-types', testAttribute)
        .its('body.id')
        .then((attributeTypeId) => {
          attributeTypeIds.push(attributeTypeId);
        });
    });
    cy.wrap(attributeTypeIds).as('attributeTypeIds');

    cy.fixture('testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto, productInd) => {
        cy.apiPOST('/products', testProduct).its('body.id').as('productId');
        cy.get<string>('@productId').then((productId) => {
          cy.get<string>('@categoryId').then((categoryId) => {
            cy.apiPOST(`/categories/${categoryId}/products`, { productId });
          });
          cy.fixture('testAttributes').then((testAttributes) => {
            cy.get<string[]>('@attributeTypeIds').then((typeIds) => {
              cy.apiPATCH(
                `/products/${productId}/attributes`,
                typeIds.map((id, i) => ({ typeId: id, value: testAttributes[i].values[productInd] })),
              );
            });
          });
        });
      });

    cy.revalidatePath('/');
  });

  it('filtering products', () => {
    cy.visit('/');
    cy.fixture('testFeaturedCategory').then((testFeaturedCategory: CategoryCreateDto) => {
      cy.contains('section', testFeaturedCategory.name).contains('a', 'View All Products').click();
    });
    cy.contains('div', 'Showing 1 - 4 (4) of 4 products').should('exist');
    cy.fixture('testAttributes').each((testAttribute: AttributeTypeDto & { values: string[] }) => {
      if (testAttribute.valueType === 'color') {
        cy.contains('div', testAttribute.name).next().find('a').should('have.length', 2);
      } else {
        testAttribute.values.forEach((value) => {
          cy.contains('div', testAttribute.name).next().contains('label', value).should('exist');
        });
      }

      cy.contains('div', testAttribute.name).next().find('a').first().click();
      cy.location('search').should('match', /^\?\d+=.+$/);
      cy.location('search').should('include', testAttribute.values[0].replaceAll(' ', '+').replaceAll('#', '%23'));
      cy.contains('div', 'Showing 1 - 4 (4) of 4 products').should('not.exist');
      cy.contains('div', 'Test product').should('have.length.lessThan', 4).should('have.length.greaterThan', 0);

      cy.contains('a', 'Clear filters').click();
      cy.location('search').should('be.empty');
      cy.contains('div', 'Showing 1 - 4 (4) of 4 products').should('exist');
    });
  });

  it('viewing product attributes', () => {
    cy.visit('/');
    cy.fixture('testProducts').then((testProducts: ProductCreateDto[]) => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.contains('div', testProducts[0].name).parent().find('a').click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.get('*').first().trigger('mouseover');
    });

    cy.get('table').should('exist');
    cy.fixture('testAttributes').each((testAttribute: AttributeTypeDto & { values: string[] }) => {
      cy.contains('td', testAttribute.name).next().should('contain', testAttribute.values[0]);
    });
  });
});
