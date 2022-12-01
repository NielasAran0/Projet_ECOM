package com.im2ag.ecom.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.im2ag.ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserOrder.class);
        UserOrder userOrder1 = new UserOrder();
        userOrder1.setId(1L);
        UserOrder userOrder2 = new UserOrder();
        userOrder2.setId(userOrder1.getId());
        assertThat(userOrder1).isEqualTo(userOrder2);
        userOrder2.setId(2L);
        assertThat(userOrder1).isNotEqualTo(userOrder2);
        userOrder1.setId(null);
        assertThat(userOrder1).isNotEqualTo(userOrder2);
    }
}
