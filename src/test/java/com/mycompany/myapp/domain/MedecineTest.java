package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MedecineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Medecine.class);
        Medecine medecine1 = new Medecine();
        medecine1.setId(1L);
        Medecine medecine2 = new Medecine();
        medecine2.setId(medecine1.getId());
        assertThat(medecine1).isEqualTo(medecine2);
        medecine2.setId(2L);
        assertThat(medecine1).isNotEqualTo(medecine2);
        medecine1.setId(null);
        assertThat(medecine1).isNotEqualTo(medecine2);
    }
}
