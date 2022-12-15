package com.im2ag.ecom.repository;

import com.im2ag.ecom.domain.SalesPost;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SalesPost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesPostRepository extends JpaRepository<SalesPost, Long> {
    @Query("SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp AND e.stock > 0 AND e.price <= :maxPrice")
    Page<SalesPost> findSalesPostsUnderMaxPrice(Pageable pageable, @Param("maxPrice") Float maxPrice);

    @Query(
        "SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp AND e.stock > 0 AND e.price <= :maxPrice AND LOWER(e.product.name) LIKE %:productName%"
    )
    Page<SalesPost> findSalesPostsUnderMaxPriceAndByName(
        Pageable pageable,
        @Param("maxPrice") Float maxPrice,
        @Param("productName") String productName
    );

    @Query(
        "SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp AND e.stock > 0 AND e.price >= :minPrice AND e.price <= :maxPrice"
    )
    Page<SalesPost> findSalesPostsInPriceRange(Pageable pageable, @Param("minPrice") Float minPrice, @Param("maxPrice") Float maxPrice);

    @Query(
        "SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp AND e.stock > 0 AND e.price >= :minPrice AND e.price <= :maxPrice AND LOWER(e.product.name) LIKE %:productName%"
    )
    Page<SalesPost> findSalesPostsInPriceRangeAndByName(
        Pageable pageable,
        @Param("minPrice") Float minPrice,
        @Param("maxPrice") Float maxPrice,
        @Param("productName") String productName
    );
}
