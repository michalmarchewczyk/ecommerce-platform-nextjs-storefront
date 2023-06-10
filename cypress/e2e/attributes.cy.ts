import { CategoryCreateDto, ProductCreateDto, AttributeTypeDto } from '../../lib/api';

describe('Attributes', () => {
  beforeEach(() => {
    cy.loadFixtures(['testAttributes', 'testProducts', 'testFeaturedCategory']);
  });

  before(() => {
    cy.clearTestData();
    cy.loadFixtures(['testAttributes', 'testProducts', 'testFeaturedCategory']);

    cy.get<CategoryCreateDto>('@testFeaturedCategory').then((testFeaturedCategory) => {
      cy.apiPOST('/categories', testFeaturedCategory).its('body.id').as('categoryId');
    });
    cy.get<string>('@categoryId').then((categoryId) => {
      cy.apiPATCH(`/categories/${categoryId}`, { groups: [{ name: 'featured' }] });
    });

    const attributeTypeIds: string[] = [];
    cy.get<AttributeTypeDto[]>('@testAttributes').each((testAttribute: AttributeTypeDto) => {
      cy.apiPOST('/attribute-types', testAttribute)
        .its('body.id')
        .then((attributeTypeId) => {
          attributeTypeIds.push(attributeTypeId);
        });
    });
    cy.wrap(attributeTypeIds).as('attributeTypeIds');

    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto, productInd) => {
        cy.apiPOST('/products', testProduct).its('body.id').as('productId');
        cy.getAliases(['productId', 'categoryId', 'testAttributes', 'attributeTypeIds']).then(
          ([productId, categoryId, testAttributes, typeIds]) => {
            cy.apiPOST(`/categories/${categoryId}/products`, { productId });
            const attributes = typeIds.map((id, i) => ({ typeId: id, value: testAttributes[i].values[productInd] }));
            cy.apiPATCH(`/products/${productId}/attributes`, attributes);
          },
        );
      });

    cy.revalidatePath('/');
  });

  it('filtering products', () => {
    cy.visit('/');
    cy.get<CategoryCreateDto>('@testFeaturedCategory').then((testFeaturedCategory) => {
      cy.contains('section', testFeaturedCategory.name).contains('a', 'View All Products').clickLink();
    });
    cy.contains('div', 'Showing 1 - 4 (4) of 4 products').should('exist');
    cy.get('@testAttributes').each((testAttribute: AttributeTypeDto & { values: string[] }) => {
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
    cy.get<ProductCreateDto[]>('@testProducts').then((testProducts) => {
      cy.contains('div', testProducts[0].name).parent().find('a').clickLink();
    });

    cy.get('table').should('exist');
    cy.get('@testAttributes').each((testAttribute: AttributeTypeDto & { values: string[] }) => {
      cy.contains('td', testAttribute.name).next().should('contain', testAttribute.values[0]);
    });
  });
});
