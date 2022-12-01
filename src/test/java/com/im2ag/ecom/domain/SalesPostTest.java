package com.im2ag.ecom.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.im2ag.ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SalesPostTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalesPost.class);
        SalesPost salesPost1 = new SalesPost();
        salesPost1.setId(1L);
        SalesPost salesPost2 = new SalesPost();
        salesPost2.setId(salesPost1.getId());
        assertThat(salesPost1).isEqualTo(salesPost2);
        salesPost2.setId(2L);
        assertThat(salesPost1).isNotEqualTo(salesPost2);
        salesPost1.setId(null);
        assertThat(salesPost1).isNotEqualTo(salesPost2);
    }
}
