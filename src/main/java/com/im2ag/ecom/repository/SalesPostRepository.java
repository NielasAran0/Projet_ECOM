package com.im2ag.ecom.repository;

import com.im2ag.ecom.domain.SalesPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SalesPost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesPostRepository extends JpaRepository<SalesPost, Long> {
    @Query("SELECT e FROM SalesPost e WHERE e.limitDate > current_timestamp and e.stock>0")
    Page<SalesPost> findConditionLimitDateAndStock(Pageable pageable);
}
