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

describe('SalesPost e2e test', () => {
  const salesPostPageUrl = '/sales-post';
  const salesPostPageUrlPattern = new RegExp('/sales-post(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const salesPostSample = {};

  let salesPost;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/sales-posts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/sales-posts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/sales-posts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (salesPost) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/sales-posts/${salesPost.id}`,
      }).then(() => {
        salesPost = undefined;
      });
    }
  });

  it('SalesPosts menu should load SalesPosts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('sales-post');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SalesPost').should('exist');
    cy.url().should('match', salesPostPageUrlPattern);
  });

  describe('SalesPost page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(salesPostPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SalesPost page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/sales-post/new$'));
        cy.getEntityCreateUpdateHeading('SalesPost');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salesPostPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/sales-posts',
          body: salesPostSample,
        }).then(({ body }) => {
          salesPost = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/sales-posts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [salesPost],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(salesPostPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details SalesPost page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('salesPost');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salesPostPageUrlPattern);
      });

      it('edit button click should load edit SalesPost page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SalesPost');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salesPostPageUrlPattern);
      });

      it('edit button click should load edit SalesPost page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SalesPost');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salesPostPageUrlPattern);
      });

      it('last delete button click should delete instance of SalesPost', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('salesPost').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', salesPostPageUrlPattern);

        salesPost = undefined;
      });
    });
  });

  describe('new SalesPost page', () => {
    beforeEach(() => {
      cy.visit(`${salesPostPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SalesPost');
    });

    it('should create an instance of SalesPost', () => {
      cy.get(`[data-cy="stock"]`).type('95510').should('have.value', '95510');

      cy.get(`[data-cy="price"]`).type('16045').should('have.value', '16045');

      cy.get(`[data-cy="limitDate"]`).type('2022-11-29').blur().should('have.value', '2022-11-29');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        salesPost = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', salesPostPageUrlPattern);
    });
  });
});
