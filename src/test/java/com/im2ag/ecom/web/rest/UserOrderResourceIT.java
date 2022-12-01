package com.im2ag.ecom.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.im2ag.ecom.IntegrationTest;
import com.im2ag.ecom.domain.UserOrder;
import com.im2ag.ecom.domain.enumeration.OrderState;
import com.im2ag.ecom.repository.UserOrderRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserOrderResourceIT {

    private static final Float DEFAULT_TOTAL_PRICE = 1F;
    private static final Float UPDATED_TOTAL_PRICE = 2F;

    private static final Float DEFAULT_DISCOUNT = 1F;
    private static final Float UPDATED_DISCOUNT = 2F;

    private static final OrderState DEFAULT_STATE = OrderState.INCART;
    private static final OrderState UPDATED_STATE = OrderState.CANCELED;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/user-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserOrderRepository userOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserOrderMockMvc;

    private UserOrder userOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserOrder createEntity(EntityManager em) {
        UserOrder userOrder = new UserOrder()
            .totalPrice(DEFAULT_TOTAL_PRICE)
            .discount(DEFAULT_DISCOUNT)
            .state(DEFAULT_STATE)
            .date(DEFAULT_DATE);
        return userOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserOrder createUpdatedEntity(EntityManager em) {
        UserOrder userOrder = new UserOrder()
            .totalPrice(UPDATED_TOTAL_PRICE)
            .discount(UPDATED_DISCOUNT)
            .state(UPDATED_STATE)
            .date(UPDATED_DATE);
        return userOrder;
    }

    @BeforeEach
    public void initTest() {
        userOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createUserOrder() throws Exception {
        int databaseSizeBeforeCreate = userOrderRepository.findAll().size();
        // Create the UserOrder
        restUserOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userOrder)))
            .andExpect(status().isCreated());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeCreate + 1);
        UserOrder testUserOrder = userOrderList.get(userOrderList.size() - 1);
        assertThat(testUserOrder.getTotalPrice()).isEqualTo(DEFAULT_TOTAL_PRICE);
        assertThat(testUserOrder.getDiscount()).isEqualTo(DEFAULT_DISCOUNT);
        assertThat(testUserOrder.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testUserOrder.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createUserOrderWithExistingId() throws Exception {
        // Create the UserOrder with an existing ID
        userOrder.setId(1L);

        int databaseSizeBeforeCreate = userOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userOrder)))
            .andExpect(status().isBadRequest());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserOrders() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        // Get all the userOrderList
        restUserOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalPrice").value(hasItem(DEFAULT_TOTAL_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].discount").value(hasItem(DEFAULT_DISCOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getUserOrder() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        // Get the userOrder
        restUserOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, userOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userOrder.getId().intValue()))
            .andExpect(jsonPath("$.totalPrice").value(DEFAULT_TOTAL_PRICE.doubleValue()))
            .andExpect(jsonPath("$.discount").value(DEFAULT_DISCOUNT.doubleValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserOrder() throws Exception {
        // Get the userOrder
        restUserOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserOrder() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();

        // Update the userOrder
        UserOrder updatedUserOrder = userOrderRepository.findById(userOrder.getId()).get();
        // Disconnect from session so that the updates on updatedUserOrder are not directly saved in db
        em.detach(updatedUserOrder);
        updatedUserOrder.totalPrice(UPDATED_TOTAL_PRICE).discount(UPDATED_DISCOUNT).state(UPDATED_STATE).date(UPDATED_DATE);

        restUserOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserOrder))
            )
            .andExpect(status().isOk());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
        UserOrder testUserOrder = userOrderList.get(userOrderList.size() - 1);
        assertThat(testUserOrder.getTotalPrice()).isEqualTo(UPDATED_TOTAL_PRICE);
        assertThat(testUserOrder.getDiscount()).isEqualTo(UPDATED_DISCOUNT);
        assertThat(testUserOrder.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testUserOrder.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserOrderWithPatch() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();

        // Update the userOrder using partial update
        UserOrder partialUpdatedUserOrder = new UserOrder();
        partialUpdatedUserOrder.setId(userOrder.getId());

        partialUpdatedUserOrder.totalPrice(UPDATED_TOTAL_PRICE).date(UPDATED_DATE);

        restUserOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserOrder))
            )
            .andExpect(status().isOk());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
        UserOrder testUserOrder = userOrderList.get(userOrderList.size() - 1);
        assertThat(testUserOrder.getTotalPrice()).isEqualTo(UPDATED_TOTAL_PRICE);
        assertThat(testUserOrder.getDiscount()).isEqualTo(DEFAULT_DISCOUNT);
        assertThat(testUserOrder.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testUserOrder.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateUserOrderWithPatch() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();

        // Update the userOrder using partial update
        UserOrder partialUpdatedUserOrder = new UserOrder();
        partialUpdatedUserOrder.setId(userOrder.getId());

        partialUpdatedUserOrder.totalPrice(UPDATED_TOTAL_PRICE).discount(UPDATED_DISCOUNT).state(UPDATED_STATE).date(UPDATED_DATE);

        restUserOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserOrder))
            )
            .andExpect(status().isOk());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
        UserOrder testUserOrder = userOrderList.get(userOrderList.size() - 1);
        assertThat(testUserOrder.getTotalPrice()).isEqualTo(UPDATED_TOTAL_PRICE);
        assertThat(testUserOrder.getDiscount()).isEqualTo(UPDATED_DISCOUNT);
        assertThat(testUserOrder.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testUserOrder.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserOrder() throws Exception {
        int databaseSizeBeforeUpdate = userOrderRepository.findAll().size();
        userOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserOrderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserOrder in the database
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserOrder() throws Exception {
        // Initialize the database
        userOrderRepository.saveAndFlush(userOrder);

        int databaseSizeBeforeDelete = userOrderRepository.findAll().size();

        // Delete the userOrder
        restUserOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, userOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserOrder> userOrderList = userOrderRepository.findAll();
        assertThat(userOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
