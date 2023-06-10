import { DeliveryMethodDto, PaymentMethodDto, ProductCreateDto } from '../../lib/api';

describe('Returns', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.loadFixtures(['testDeliveryMethod', 'testPaymentMethod', 'testProducts', 'testOrder']);

    cy.get<DeliveryMethodDto>('@testDeliveryMethod').then((testDeliveryMethod) => {
      cy.apiPOST('/delivery-methods', testDeliveryMethod).its('body.id').as('deliveryMethodId');
    });

    cy.get<PaymentMethodDto>('@testPaymentMethod').then((testPaymentMethod) => {
      cy.apiPOST('/payment-methods', testPaymentMethod).its('body.id').as('paymentMethodId');
    });

    const productIds: string[] = [];
    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.apiPOST('/products', testProduct)
          .its('body.id')
          .then((id) => {
            productIds.push(id);
          });
      });
    cy.wrap(productIds).as('productIds');

    cy.getAliases<[Record<string, string>, number, number, number[]]>([
      'testOrder',
      'deliveryMethodId',
      'paymentMethodId',
      'productIds',
    ]).then(([testOrder, deliveryMethodId, paymentMethodId, pIds]) => {
      cy.apiPOST('/orders', {
        fullName: testOrder.fullName,
        contactEmail: testOrder.contactEmail,
        contactPhone: testOrder.contactPhoneCountry + testOrder.contactPhone,
        delivery: {
          methodId: deliveryMethodId,
          address: testOrder.address,
          city: testOrder.city,
          country: testOrder.countryCode,
        },
        payment: {
          methodId: paymentMethodId,
        },
        items: pIds.map((id) => ({ productId: id, quantity: 5 })),
      })
        .its('body.id')
        .as('orderId');
    });
  });

  it('creating return', () => {
    cy.visit('/account/orders');
    cy.get<string>('@orderId').then((id) => {
      cy.contains('a', `Order #${id}`).clickLink();
      cy.location('pathname').should('eq', `/account/orders/${id}`);
      cy.contains('h2', `Order #${id}`).should('exist');
      cy.contains('h2', `Order #${id}`).next().should('contain.text', 'pending');

      cy.contains('button', 'Make return').click();
      cy.get('div[role=dialog]').contains('h3', `Return order #${id}`).should('exist');
      cy.get('div[role=dialog]').find('textarea').type('Test return message');
      cy.get('div[role=dialog]').contains('button', 'Submit').click();

      cy.contains('h2', `Order #${id}`).next().should('contain.text', 'refunded');
      cy.contains('h3', 'Return').next().should('contain.text', 'open');
      cy.contains('div', 'Test return message').should('exist');

      cy.visit('/account/returns');
      cy.contains('a', `Return for order #${id}`).clickLink();
      cy.location('pathname').should('eq', `/account/orders/${id}`);
    });
  });
});
