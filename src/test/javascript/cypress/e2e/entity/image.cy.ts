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

describe('Image e2e test', () => {
  const imagePageUrl = '/image';
  const imagePageUrlPattern = new RegExp('/image(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const imageSample = {};

  let image;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/images+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/images').as('postEntityRequest');
    cy.intercept('DELETE', '/api/images/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (image) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/images/${image.id}`,
      }).then(() => {
        image = undefined;
      });
    }
  });

  it('Images menu should load Images page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('image');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Image').should('exist');
    cy.url().should('match', imagePageUrlPattern);
  });

  describe('Image page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(imagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Image page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/image/new$'));
        cy.getEntityCreateUpdateHeading('Image');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', imagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/images',
          body: imageSample,
        }).then(({ body }) => {
          image = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/images+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [image],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(imagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Image page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('image');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', imagePageUrlPattern);
      });

      it('edit button click should load edit Image page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Image');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', imagePageUrlPattern);
      });

      it('edit button click should load edit Image page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Image');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', imagePageUrlPattern);
      });

      it('last delete button click should delete instance of Image', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('image').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', imagePageUrlPattern);

        image = undefined;
      });
    });
  });

  describe('new Image page', () => {
    beforeEach(() => {
      cy.visit(`${imagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Image');
    });

    it('should create an instance of Image', () => {
      cy.get(`[data-cy="url"]`).type('https://finn.biz').should('have.value', 'https://finn.biz');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        image = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', imagePageUrlPattern);
    });
  });
});
