package com.im2ag.ecom.web.rest;

import com.im2ag.ecom.domain.UserOrder;
import com.im2ag.ecom.repository.UserOrderRepository;
import com.im2ag.ecom.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
 * REST controller for managing {@link com.im2ag.ecom.domain.UserOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserOrderResource {

    private final Logger log = LoggerFactory.getLogger(UserOrderResource.class);

    private static final String ENTITY_NAME = "userOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserOrderRepository userOrderRepository;

    public UserOrderResource(UserOrderRepository userOrderRepository) {
        this.userOrderRepository = userOrderRepository;
    }

    /**
     * {@code POST  /user-orders} : Create a new userOrder.
     *
     * @param userOrder the userOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userOrder, or with status {@code 400 (Bad Request)} if the userOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-orders")
    public ResponseEntity<UserOrder> createUserOrder(@RequestBody UserOrder userOrder) throws URISyntaxException {
        log.debug("REST request to save UserOrder : {}", userOrder);
        if (userOrder.getId() != null) {
            throw new BadRequestAlertException("A new userOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserOrder result = userOrderRepository.save(userOrder);
        return ResponseEntity
            .created(new URI("/api/user-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-orders/:id} : Updates an existing userOrder.
     *
     * @param id the id of the userOrder to save.
     * @param userOrder the userOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userOrder,
     * or with status {@code 400 (Bad Request)} if the userOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-orders/{id}")
    public ResponseEntity<UserOrder> updateUserOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserOrder userOrder
    ) throws URISyntaxException {
        log.debug("REST request to update UserOrder : {}, {}", id, userOrder);
        if (userOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserOrder result = userOrderRepository.save(userOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-orders/:id} : Partial updates given fields of an existing userOrder, field will ignore if it is null
     *
     * @param id the id of the userOrder to save.
     * @param userOrder the userOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userOrder,
     * or with status {@code 400 (Bad Request)} if the userOrder is not valid,
     * or with status {@code 404 (Not Found)} if the userOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the userOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserOrder> partialUpdateUserOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserOrder userOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserOrder partially : {}, {}", id, userOrder);
        if (userOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserOrder> result = userOrderRepository
            .findById(userOrder.getId())
            .map(existingUserOrder -> {
                if (userOrder.getTotalPrice() != null) {
                    existingUserOrder.setTotalPrice(userOrder.getTotalPrice());
                }
                if (userOrder.getDiscount() != null) {
                    existingUserOrder.setDiscount(userOrder.getDiscount());
                }
                if (userOrder.getState() != null) {
                    existingUserOrder.setState(userOrder.getState());
                }
                if (userOrder.getDate() != null) {
                    existingUserOrder.setDate(userOrder.getDate());
                }

                return existingUserOrder;
            })
            .map(userOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /user-orders} : get all the userOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userOrders in body.
     */
    @GetMapping("/user-orders")
    public List<UserOrder> getAllUserOrders() {
        log.debug("REST request to get all UserOrders");
        return userOrderRepository.findAll();
    }

    /**
     * {@code GET  /user-orders/:id} : get the "id" userOrder.
     *
     * @param id the id of the userOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-orders/{id}")
    public ResponseEntity<UserOrder> getUserOrder(@PathVariable Long id) {
        log.debug("REST request to get UserOrder : {}", id);
        Optional<UserOrder> userOrder = userOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userOrder);
    }

    /**
     * {@code DELETE  /user-orders/:id} : delete the "id" userOrder.
     *
     * @param id the id of the userOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-orders/{id}")
    public ResponseEntity<Void> deleteUserOrder(@PathVariable Long id) {
        log.debug("REST request to delete UserOrder : {}", id);
        userOrderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /user-orders} : get all the userOrders for a given app user
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userOrders in body.
     */
    @GetMapping("/user-orders/app-user/{id}")
    public List<Long> getAllUserOrdersAppUser(@PathVariable Long id) {
        log.debug("REST request to get all UserOrders");
        List<UserOrder> list = userOrderRepository.findAll();
        List<Long> app_userList = new ArrayList<Long>();
        for (UserOrder userOrder : list) {
            if (userOrder.getAppUser().getId() == id) {
                app_userList.add(userOrder.getId());
            }
        }
        return app_userList;
    }
}
