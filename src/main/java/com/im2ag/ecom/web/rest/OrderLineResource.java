package com.im2ag.ecom.web.rest;

import com.im2ag.ecom.domain.OrderLine;
import com.im2ag.ecom.repository.OrderLineRepository;
import com.im2ag.ecom.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.im2ag.ecom.domain.OrderLine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderLineResource {

    private final Logger log = LoggerFactory.getLogger(OrderLineResource.class);

    private static final String ENTITY_NAME = "orderLine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderLineRepository orderLineRepository;

    public OrderLineResource(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    /**
     * {@code POST  /order-lines} : Create a new orderLine.
     *
     * @param orderLine the orderLine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderLine, or with status {@code 400 (Bad Request)} if the orderLine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-lines")
    public ResponseEntity<OrderLine> createOrderLine(@RequestBody OrderLine orderLine) throws URISyntaxException {
        log.debug("REST request to save OrderLine : {}", orderLine);
        if (orderLine.getId() != null) {
            throw new BadRequestAlertException("A new orderLine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderLine result = orderLineRepository.save(orderLine);
        return ResponseEntity
            .created(new URI("/api/order-lines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-lines/:id} : Updates an existing orderLine.
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-lines/{id}")
    public ResponseEntity<OrderLine> updateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        log.debug("REST request to update OrderLine : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderLine result = orderLineRepository.save(orderLine);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-lines/:id} : Partial updates given fields of an existing orderLine, field will ignore if it is null
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 404 (Not Found)} if the orderLine is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-lines/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderLine> partialUpdateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderLine partially : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderLine> result = orderLineRepository
            .findById(orderLine.getId())
            .map(existingOrderLine -> {
                if (orderLine.getQuantity() != null) {
                    existingOrderLine.setQuantity(orderLine.getQuantity());
                }
                if (orderLine.getUnitPrice() != null) {
                    existingOrderLine.setUnitPrice(orderLine.getUnitPrice());
                }
                if (orderLine.getDelivered() != null) {
                    existingOrderLine.setDelivered(orderLine.getDelivered());
                }

                return existingOrderLine;
            })
            .map(orderLineRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString())
        );
    }

    /**
     * {@code GET  /order-lines} : get all the orderLines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderLines in body.
     */
    @GetMapping("/order-lines")
    public List<OrderLine> getAllOrderLines() {
        log.debug("REST request to get all OrderLines");
        return orderLineRepository.findAll();
    }

    /**
     * {@code GET  /order-lines/:id} : get the "id" orderLine.
     *
     * @param id the id of the orderLine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderLine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-lines/{id}")
    public ResponseEntity<OrderLine> getOrderLine(@PathVariable Long id) {
        log.debug("REST request to get OrderLine : {}", id);
        Optional<OrderLine> orderLine = orderLineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderLine);
    }

    /**
     * {@code DELETE  /order-lines/:id} : delete the "id" orderLine.
     *
     * @param id the id of the orderLine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-lines/{id}")
    public ResponseEntity<Void> deleteOrderLine(@PathVariable Long id) {
        log.debug("REST request to delete OrderLine : {}", id);
        orderLineRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
