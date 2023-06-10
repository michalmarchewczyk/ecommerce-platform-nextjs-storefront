import { RegisterDto } from '../../lib/api';

describe('Auth', () => {
  beforeEach(() => {
    cy.loadFixtures(['testUser']);
    cy.apiGET('/users').then((response) => {
      cy.get<RegisterDto>('@testUser').then((testUser) => {
        const user = response.body.find((u) => u.email === testUser.email);
        if (user) {
          cy.apiDELETE(`/users/${user.id}`);
        }
      });
    });
  });

  it('register', () => {
    cy.visit('/register');
    cy.contains('h2', 'Create account').should('be.visible');
    cy.get<RegisterDto>('@testUser').then((testUser) => {
      cy.contains('label', 'Email').next().find('input').type(testUser.email);
      cy.contains('label', 'First name').next().find('input').type(testUser.firstName);
      cy.contains('label', 'Last name').next().find('input').type(testUser.lastName);
      cy.contains('label', 'Password').next().find('input').type(testUser.password);
      cy.intercept('POST', '/auth/register').as('register');
      cy.contains('button', 'Create account').click();
      cy.wait('@register').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
      cy.location('pathname').should('equal', '/login');
    });
  });

  it('login', () => {
    cy.get<RegisterDto>('@testUser').then((testUser) => {
      cy.apiPOST('/auth/register', testUser);
    });
    cy.visit('/login');
    cy.contains('h2', 'Sign in').should('be.visible');
    cy.get<RegisterDto & { initials: string }>('@testUser').then((testUser) => {
      cy.contains('label', 'Email').next().find('input').type(testUser.email);
      cy.contains('label', 'Password').next().find('input').type(testUser.password);
      cy.intercept('POST', '/auth/login').as('login');
      cy.contains('button', 'Sign in').click();
      cy.wait('@login').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
      cy.location('pathname').should('equal', '/');
      cy.get('header').contains('a', testUser.initials).trigger('mouseover');
      cy.contains('div[role=dialog]', 'Test User').should('exist');
    });
  });

  it('logout', () => {
    cy.get<RegisterDto & { initials: string }>('@testUser').then((testUser) => {
      cy.apiPOST('/auth/register', testUser);
      cy.apiPOST('/auth/login', testUser);
      cy.visit('/');
      cy.get('header').contains('a', testUser.initials).trigger('mouseover');
      cy.contains('div[role=dialog]', 'Test User').should('exist');
      cy.intercept('POST', '/auth/logout').as('logout');
      cy.contains('a', 'Sign out').click();
      cy.wait('@logout').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
      cy.location('pathname').should('equal', '/');
    });
  });
});
