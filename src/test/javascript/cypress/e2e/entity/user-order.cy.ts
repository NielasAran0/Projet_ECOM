import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('UserOrder e2e test', () => {
  const userOrderPageUrl = '/user-order';
  const userOrderPageUrlPattern = new RegExp('/user-order(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userOrderSample = {};

  let userOrder;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-orders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-orders').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-orders/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userOrder) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-orders/${userOrder.id}`,
      }).then(() => {
        userOrder = undefined;
      });
    }
  });

  it('UserOrders menu should load UserOrders page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-order');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserOrder').should('exist');
    cy.url().should('match', userOrderPageUrlPattern);
  });

  describe('UserOrder page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userOrderPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserOrder page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-order/new$'));
        cy.getEntityCreateUpdateHeading('UserOrder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userOrderPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-orders',
          body: userOrderSample,
        }).then(({ body }) => {
          userOrder = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-orders+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userOrder],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userOrderPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserOrder page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userOrder');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userOrderPageUrlPattern);
      });

      it('edit button click should load edit UserOrder page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserOrder');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userOrderPageUrlPattern);
      });

      it('edit button click should load edit UserOrder page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserOrder');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userOrderPageUrlPattern);
      });

      it('last delete button click should delete instance of UserOrder', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userOrder').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userOrderPageUrlPattern);

        userOrder = undefined;
      });
    });
  });

  describe('new UserOrder page', () => {
    beforeEach(() => {
      cy.visit(`${userOrderPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserOrder');
    });

    it('should create an instance of UserOrder', () => {
      cy.get(`[data-cy="totalPrice"]`).type('83390').should('have.value', '83390');

      cy.get(`[data-cy="discount"]`).type('7276').should('have.value', '7276');

      cy.get(`[data-cy="state"]`).select('PAID');

      cy.get(`[data-cy="date"]`).type('2022-12-01').blur().should('have.value', '2022-12-01');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userOrder = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userOrderPageUrlPattern);
    });
  });
});
