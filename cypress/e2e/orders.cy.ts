import {
  ProductCreateDto,
  DeliveryMethodDto,
  PaymentMethodDto,
  DeliveryMethod,
  PaymentMethod,
  Product,
} from '../../lib/api';

describe('Orders', () => {
  beforeEach(() => {
    cy.loadFixtures(['testDeliveryMethod', 'testPaymentMethod', 'testProducts', 'testOrder']);
  });

  before(() => {
    cy.clearTestData();
    cy.loadFixtures(['testDeliveryMethod', 'testPaymentMethod', 'testProducts', 'testOrder']);

    cy.get<DeliveryMethodDto>('@testDeliveryMethod').then((testDeliveryMethod) => {
      cy.apiPOST('/delivery-methods', testDeliveryMethod);
    });

    cy.get<PaymentMethodDto>('@testPaymentMethod').then((testPaymentMethod) => {
      cy.apiPOST('/payment-methods', testPaymentMethod);
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

    cy.get<string[]>('@productIds').then((ids) => {
      cy.apiPUT('/carts/my', {
        items: ids.map((id) => ({ productId: id, quantity: 1 })),
      });
    });
  });

  it('creating order', () => {
    cy.visit('/cart');
    cy.contains('a', 'Checkout').invoke('attr', 'href').should('eq', '/checkout');
    cy.visit('/checkout');

    cy.location('pathname').should('eq', '/checkout');
    cy.contains('h2', 'Checkout').should('exist');

    cy.get<DeliveryMethodDto>('@testDeliveryMethod').then((testDeliveryMethod) => {
      cy.contains('label', testDeliveryMethod.name).click();
    });
    cy.get<Record<string, string>>('@testOrder').then((testOrder) => {
      cy.contains('label', 'Full name').next().find('input').type(testOrder.fullName);
      cy.contains('label', 'Contact email').next().find('input').type(testOrder.contactEmail);
      cy.contains('label', 'Contact phone').parent().parent().find('div[role=combobox]').click();
      cy.get('div[role=listbox]').contains('div[role=option]', testOrder.contactPhoneCountry).click();
      cy.contains('label', 'Contact phone').parent().parent().find('input').last().type(testOrder.contactPhone);
      cy.contains('label', 'Address').next().find('input').type(testOrder.address);
      cy.contains('label', 'City').next().find('input').type(testOrder.city);
      cy.contains('label', 'Country').next().find('input').last().type(testOrder.country);
      cy.get('div[role=listbox]').contains('div[role=option]', testOrder.country).click();
    });
    cy.contains('button', 'Next').click();

    cy.get<PaymentMethodDto>('@testPaymentMethod').then((testPaymentMethod) => {
      cy.contains('label', testPaymentMethod.name).click();
    });
    cy.contains('button', 'Next').click();

    cy.get('@testProducts')
      .invoke('slice', 0, 4)
      .each((testProduct: ProductCreateDto) => {
        cy.contains('div', `1 x ${testProduct.name}`).should('exist');
        cy.contains('div', testProduct.price).should('exist');
      });
    cy.get<DeliveryMethodDto>('@testDeliveryMethod').then((testDeliveryMethod) => {
      cy.contains('div', testDeliveryMethod.name).should('exist');
      cy.contains('div', testDeliveryMethod.price).should('exist');
    });
    cy.get<PaymentMethodDto>('@testPaymentMethod').then((testPaymentMethod) => {
      cy.contains('div', testPaymentMethod.name).should('exist');
      cy.contains('div', testPaymentMethod.price).should('exist');
    });
    cy.contains('div', 'Total').should('exist');
    cy.get<Record<string, string>>('@testOrder').then((testOrder) => {
      cy.contains('div', testOrder.fullName).should('exist');
      cy.contains('div', testOrder.contactEmail).should('exist');
      cy.contains('div', testOrder.contactPhone).should('exist');
      cy.contains('div', testOrder.address).should('exist');
      cy.contains('div', testOrder.city).should('exist');
      cy.contains('div', testOrder.countryCode).should('exist');
    });

    cy.contains('button', 'Order').click();
    cy.contains('div', 'Thank you for your order!').should('exist');
    cy.contains('a', 'View details')
      .invoke('attr', 'href')
      .should('match', /^\/account\/orders\/[0-9a-f-]+$/);
  });

  it('viewing order', () => {
    cy.apiGET('/products')
      .its('body')
      .then((products: Product[]) => {
        return cy.wrap(products.filter((p: Product) => p.name.toLowerCase().includes('test')));
      })
      .as('products');
    cy.apiGET('/delivery-methods')
      .its('body')
      .then((deliveryMethods: DeliveryMethod[]) => {
        return cy.wrap(deliveryMethods.find((m) => m.name.toLowerCase().includes('test')).id);
      })
      .as('deliveryMethodId');
    cy.apiGET('/payment-methods')
      .its('body')
      .then((paymentMethods: PaymentMethod[]) => {
        return cy.wrap(paymentMethods.find((m) => m.name.toLowerCase().includes('test')).id);
      })
      .as('paymentMethodId');

    cy.getAliases<[Record<string, string>, number, number, Product[]]>([
      'testOrder',
      'deliveryMethodId',
      'paymentMethodId',
      'products',
    ]).then(([testOrder, deliveryMethodId, paymentMethodId, products]) => {
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
        items: products.map((p) => ({ productId: p.id, quantity: 3 })),
      })
        .its('body.id')
        .as('orderId');
    });
    cy.visit('/account/orders');

    cy.get<string>('@orderId').then((id) => {
      cy.contains('a', `Order #${id}`).clickLink();
      cy.location('pathname').should('eq', `/account/orders/${id}`);
      cy.contains('h2', `Order #${id}`).should('exist');
    });

    cy.get<DeliveryMethodDto>('@testDeliveryMethod').then((testDeliveryMethod) => {
      cy.contains('div', testDeliveryMethod.name).should('exist');
      cy.contains('div', testDeliveryMethod.price).should('exist');
    });
    cy.get<PaymentMethodDto>('@testPaymentMethod').then((testPaymentMethod) => {
      cy.contains('div', testPaymentMethod.name).should('exist');
      cy.contains('div', testPaymentMethod.price).should('exist');
    });
    cy.contains('div', 'Total').should('exist');
    cy.get<Record<string, string>>('@testOrder').then((testOrder) => {
      cy.contains('div', testOrder.fullName).should('exist');
      cy.contains('div', testOrder.contactEmail).should('exist');
      cy.contains('div', testOrder.contactPhone).should('exist');
      cy.contains('div', testOrder.address).should('exist');
      cy.contains('div', testOrder.city).should('exist');
      cy.contains('div', testOrder.countryCode).should('exist');
    });
    cy.get('@products').each((product: Product) => {
      cy.contains('div', `3 x ${product.name}`).should('exist');
    });
  });
});
