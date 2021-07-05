package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RendezVousTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RendezVous.class);
        RendezVous rendezVous1 = new RendezVous();
        rendezVous1.setId(1L);
        RendezVous rendezVous2 = new RendezVous();
        rendezVous2.setId(rendezVous1.getId());
        assertThat(rendezVous1).isEqualTo(rendezVous2);
        rendezVous2.setId(2L);
        assertThat(rendezVous1).isNotEqualTo(rendezVous2);
        rendezVous1.setId(null);
        assertThat(rendezVous1).isNotEqualTo(rendezVous2);
    }
}
