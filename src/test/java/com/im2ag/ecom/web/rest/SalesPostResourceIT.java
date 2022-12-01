package com.im2ag.ecom.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.im2ag.ecom.IntegrationTest;
import com.im2ag.ecom.domain.SalesPost;
import com.im2ag.ecom.repository.SalesPostRepository;
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
 * Integration tests for the {@link SalesPostResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalesPostResourceIT {

    private static final Integer DEFAULT_STOCK = 1;
    private static final Integer UPDATED_STOCK = 2;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final LocalDate DEFAULT_LIMIT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LIMIT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/sales-posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalesPostRepository salesPostRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesPostMockMvc;

    private SalesPost salesPost;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesPost createEntity(EntityManager em) {
        SalesPost salesPost = new SalesPost().stock(DEFAULT_STOCK).price(DEFAULT_PRICE).limitDate(DEFAULT_LIMIT_DATE);
        return salesPost;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesPost createUpdatedEntity(EntityManager em) {
        SalesPost salesPost = new SalesPost().stock(UPDATED_STOCK).price(UPDATED_PRICE).limitDate(UPDATED_LIMIT_DATE);
        return salesPost;
    }

    @BeforeEach
    public void initTest() {
        salesPost = createEntity(em);
    }

    @Test
    @Transactional
    void createSalesPost() throws Exception {
        int databaseSizeBeforeCreate = salesPostRepository.findAll().size();
        // Create the SalesPost
        restSalesPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesPost)))
            .andExpect(status().isCreated());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeCreate + 1);
        SalesPost testSalesPost = salesPostList.get(salesPostList.size() - 1);
        assertThat(testSalesPost.getStock()).isEqualTo(DEFAULT_STOCK);
        assertThat(testSalesPost.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testSalesPost.getLimitDate()).isEqualTo(DEFAULT_LIMIT_DATE);
    }

    @Test
    @Transactional
    void createSalesPostWithExistingId() throws Exception {
        // Create the SalesPost with an existing ID
        salesPost.setId(1L);

        int databaseSizeBeforeCreate = salesPostRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesPost)))
            .andExpect(status().isBadRequest());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSalesPosts() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        // Get all the salesPostList
        restSalesPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesPost.getId().intValue())))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].limitDate").value(hasItem(DEFAULT_LIMIT_DATE.toString())));
    }

    @Test
    @Transactional
    void getSalesPost() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        // Get the salesPost
        restSalesPostMockMvc
            .perform(get(ENTITY_API_URL_ID, salesPost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salesPost.getId().intValue()))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.limitDate").value(DEFAULT_LIMIT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSalesPost() throws Exception {
        // Get the salesPost
        restSalesPostMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSalesPost() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();

        // Update the salesPost
        SalesPost updatedSalesPost = salesPostRepository.findById(salesPost.getId()).get();
        // Disconnect from session so that the updates on updatedSalesPost are not directly saved in db
        em.detach(updatedSalesPost);
        updatedSalesPost.stock(UPDATED_STOCK).price(UPDATED_PRICE).limitDate(UPDATED_LIMIT_DATE);

        restSalesPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalesPost.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalesPost))
            )
            .andExpect(status().isOk());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
        SalesPost testSalesPost = salesPostList.get(salesPostList.size() - 1);
        assertThat(testSalesPost.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testSalesPost.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSalesPost.getLimitDate()).isEqualTo(UPDATED_LIMIT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salesPost.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesPost)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalesPostWithPatch() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();

        // Update the salesPost using partial update
        SalesPost partialUpdatedSalesPost = new SalesPost();
        partialUpdatedSalesPost.setId(salesPost.getId());

        partialUpdatedSalesPost.stock(UPDATED_STOCK).price(UPDATED_PRICE);

        restSalesPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesPost))
            )
            .andExpect(status().isOk());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
        SalesPost testSalesPost = salesPostList.get(salesPostList.size() - 1);
        assertThat(testSalesPost.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testSalesPost.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSalesPost.getLimitDate()).isEqualTo(DEFAULT_LIMIT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSalesPostWithPatch() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();

        // Update the salesPost using partial update
        SalesPost partialUpdatedSalesPost = new SalesPost();
        partialUpdatedSalesPost.setId(salesPost.getId());

        partialUpdatedSalesPost.stock(UPDATED_STOCK).price(UPDATED_PRICE).limitDate(UPDATED_LIMIT_DATE);

        restSalesPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesPost))
            )
            .andExpect(status().isOk());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
        SalesPost testSalesPost = salesPostList.get(salesPostList.size() - 1);
        assertThat(testSalesPost.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testSalesPost.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSalesPost.getLimitDate()).isEqualTo(UPDATED_LIMIT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salesPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalesPost() throws Exception {
        int databaseSizeBeforeUpdate = salesPostRepository.findAll().size();
        salesPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesPostMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(salesPost))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesPost in the database
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalesPost() throws Exception {
        // Initialize the database
        salesPostRepository.saveAndFlush(salesPost);

        int databaseSizeBeforeDelete = salesPostRepository.findAll().size();

        // Delete the salesPost
        restSalesPostMockMvc
            .perform(delete(ENTITY_API_URL_ID, salesPost.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SalesPost> salesPostList = salesPostRepository.findAll();
        assertThat(salesPostList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
