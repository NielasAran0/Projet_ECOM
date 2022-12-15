package com.im2ag.ecom.web.rest;

import com.im2ag.ecom.domain.SalesPost;
import com.im2ag.ecom.repository.SalesPostRepository;
import com.im2ag.ecom.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.im2ag.ecom.domain.SalesPost}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalesPostResource {

    private final Logger log = LoggerFactory.getLogger(SalesPostResource.class);

    private static final String ENTITY_NAME = "salesPost";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesPostRepository salesPostRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public SalesPostResource(SalesPostRepository salesPostRepository) {
        this.salesPostRepository = salesPostRepository;
    }

    /**
     * {@code POST  /sales-posts} : Create a new salesPost.
     *
     * @param salesPost the salesPost to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new salesPost, or with status {@code 400 (Bad Request)} if
     *         the salesPost has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales-posts")
    public ResponseEntity<SalesPost> createSalesPost(@RequestBody SalesPost salesPost) throws URISyntaxException {
        log.debug("REST request to save SalesPost : {}", salesPost);
        if (salesPost.getId() != null) {
            throw new BadRequestAlertException("A new salesPost cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalesPost result = salesPostRepository.save(salesPost);
        return ResponseEntity
            .created(new URI("/api/sales-posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales-posts/:id} : Updates an existing salesPost.
     *
     * @param id        the id of the salesPost to save.
     * @param salesPost the salesPost to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated salesPost,
     *         or with status {@code 400 (Bad Request)} if the salesPost is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the salesPost
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales-posts/{id}")
    public ResponseEntity<SalesPost> updateSalesPost(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesPost salesPost
    ) throws URISyntaxException {
        log.debug("REST request to update SalesPost : {}, {}", id, salesPost);
        if (salesPost.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesPost.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesPostRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SalesPost result = salesPostRepository.save(salesPost);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesPost.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sales-posts/:id} : Partial updates given fields of an existing
     * salesPost, field will ignore if it is null
     *
     * @param id        the id of the salesPost to save.
     * @param salesPost the salesPost to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated salesPost,
     *         or with status {@code 400 (Bad Request)} if the salesPost is not
     *         valid,
     *         or with status {@code 404 (Not Found)} if the salesPost is not found,
     *         or with status {@code 500 (Internal Server Error)} if the salesPost
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sales-posts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SalesPost> partialUpdateSalesPost(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesPost salesPost
    ) throws URISyntaxException {
        log.debug("REST request to partial update SalesPost partially : {}, {}", id, salesPost);
        if (salesPost.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesPost.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesPostRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SalesPost> result = salesPostRepository
            .findById(salesPost.getId())
            .map(existingSalesPost -> {
                if (salesPost.getStock() != null) {
                    existingSalesPost.setStock(salesPost.getStock());
                }
                if (salesPost.getPrice() != null) {
                    existingSalesPost.setPrice(salesPost.getPrice());
                }
                if (salesPost.getLimitDate() != null) {
                    existingSalesPost.setLimitDate(salesPost.getLimitDate());
                }

                return existingSalesPost;
            })
            .map(salesPostRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesPost.getId().toString())
        );
    }

    /**
     * {@code GET  /sales-posts} : get all the salesPosts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of salesPosts in body.
     */
    @GetMapping("/sales-posts")
    public ResponseEntity<List<SalesPost>> getAllSalesPosts(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String home,
        @RequestParam(required = false) Float minPrice,
        @RequestParam(required = false) Float maxPrice,
        @RequestParam(required = false) String productName
    ) {
        log.debug("REST request to get a page of SalesPosts");
        Page<SalesPost> page;

        if (home != null) {
            Sort sort = Sort.by("limitDate").ascending();
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

            if (productName == null) {
                if (minPrice == null) {
                    page = salesPostRepository.findSalesPostsUnderMaxPrice(pageable, maxPrice);
                } else {
                    page = salesPostRepository.findSalesPostsInPriceRange(pageable, minPrice, maxPrice);
                }
            } else {
                if (minPrice == null) {
                    page = salesPostRepository.findSalesPostsUnderMaxPriceAndByName(pageable, maxPrice, productName.toLowerCase());
                } else {
                    page = salesPostRepository.findSalesPostsInPriceRangeAndByName(pageable, minPrice, maxPrice, productName.toLowerCase());
                }
            }
        } else {
            page = salesPostRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sales-posts/:id} : get the "id" salesPost.
     *
     * @param id the id of the salesPost to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the salesPost, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales-posts/{id}")
    public ResponseEntity<SalesPost> getSalesPost(@PathVariable Long id) {
        log.debug("REST request to get SalesPost : {}", id);
        Optional<SalesPost> salesPost = salesPostRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(salesPost);
    }

    /**
     * {@code DELETE  /sales-posts/:id} : delete the "id" salesPost.
     *
     * @param id the id of the salesPost to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales-posts/{id}")
    public ResponseEntity<Void> deleteSalesPost(@PathVariable Long id) {
        log.debug("REST request to delete SalesPost : {}", id);
        salesPostRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PUT /sales-posts/stock} : update the stock of the given product if possible
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/sales-posts/stock")
    public ResponseEntity<Void> updateQuantities(@RequestBody Entry<Long, Integer> product_command_quantities) {
        log.debug("REST request to update stock");
        List<SalesPost> sList = salesPostRepository.findAll();
        Long id = -1L;
        for (SalesPost salesPost : sList) {
            if (salesPost.getProduct().getId() == product_command_quantities.getKey()) {
                id = salesPost.getId();
            }
        }
        try {
            entityManager.getTransaction().begin();
            // create the query
            //Query("SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp AND e.stock > 0 AND e.price <= :maxPrice")
            Query query = entityManager.createQuery("SELECT e FROM SalesPost e WHERE e.id = :id").setParameter("id", id);

            // lock the row by appending "FOR UPDATE" to the query
            query.setLockMode(LockModeType.PESSIMISTIC_WRITE);

            SalesPost salesPost = (SalesPost) query.getSingleResult();
            Integer newStock = salesPost.getStock() - product_command_quantities.getValue();
            if (newStock < 0) {
                throw new IllegalArgumentException("Stock trop faible");
            }
            Query updateQuery = entityManager.createQuery("UPDATE SalesPost e SET e.stock = :newStock WHERE e.id = :id");
            query.setParameter("newStock", newStock);
            query.setParameter("id", id);

            updateQuery.executeUpdate();

            entityManager.getTransaction().commit();
        } catch (Exception e) {
            entityManager.getTransaction().rollback();
        } finally {
            entityManager.close();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
