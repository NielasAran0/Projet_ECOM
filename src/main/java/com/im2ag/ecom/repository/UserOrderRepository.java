package com.im2ag.ecom.repository;

import com.im2ag.ecom.domain.UserOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserOrderRepository extends JpaRepository<UserOrder, Long> {}
