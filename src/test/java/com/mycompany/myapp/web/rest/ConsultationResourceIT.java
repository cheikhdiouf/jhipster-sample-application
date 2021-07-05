package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Consultation;
import com.mycompany.myapp.repository.ConsultationRepository;
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
 * Integration tests for the {@link ConsultationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsultationResourceIT {

    private static final LocalDate DEFAULT_DATE_COMSULTATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_COMSULTATION = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_PRIX_CONSULTATION = 1D;
    private static final Double UPDATED_PRIX_CONSULTATION = 2D;

    private static final String DEFAULT_RAPPORT_CONSULTATION = "AAAAAAAAAA";
    private static final String UPDATED_RAPPORT_CONSULTATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/consultations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsultationMockMvc;

    private Consultation consultation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createEntity(EntityManager em) {
        Consultation consultation = new Consultation()
            .dateComsultation(DEFAULT_DATE_COMSULTATION)
            .prixConsultation(DEFAULT_PRIX_CONSULTATION)
            .rapportConsultation(DEFAULT_RAPPORT_CONSULTATION);
        return consultation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultation createUpdatedEntity(EntityManager em) {
        Consultation consultation = new Consultation()
            .dateComsultation(UPDATED_DATE_COMSULTATION)
            .prixConsultation(UPDATED_PRIX_CONSULTATION)
            .rapportConsultation(UPDATED_RAPPORT_CONSULTATION);
        return consultation;
    }

    @BeforeEach
    public void initTest() {
        consultation = createEntity(em);
    }

    @Test
    @Transactional
    void createConsultation() throws Exception {
        int databaseSizeBeforeCreate = consultationRepository.findAll().size();
        // Create the Consultation
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isCreated());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate + 1);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateComsultation()).isEqualTo(DEFAULT_DATE_COMSULTATION);
        assertThat(testConsultation.getPrixConsultation()).isEqualTo(DEFAULT_PRIX_CONSULTATION);
        assertThat(testConsultation.getRapportConsultation()).isEqualTo(DEFAULT_RAPPORT_CONSULTATION);
    }

    @Test
    @Transactional
    void createConsultationWithExistingId() throws Exception {
        // Create the Consultation with an existing ID
        consultation.setId(1L);

        int databaseSizeBeforeCreate = consultationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsultations() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        // Get all the consultationList
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consultation.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateComsultation").value(hasItem(DEFAULT_DATE_COMSULTATION.toString())))
            .andExpect(jsonPath("$.[*].prixConsultation").value(hasItem(DEFAULT_PRIX_CONSULTATION.doubleValue())))
            .andExpect(jsonPath("$.[*].rapportConsultation").value(hasItem(DEFAULT_RAPPORT_CONSULTATION)));
    }

    @Test
    @Transactional
    void getConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        // Get the consultation
        restConsultationMockMvc
            .perform(get(ENTITY_API_URL_ID, consultation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consultation.getId().intValue()))
            .andExpect(jsonPath("$.dateComsultation").value(DEFAULT_DATE_COMSULTATION.toString()))
            .andExpect(jsonPath("$.prixConsultation").value(DEFAULT_PRIX_CONSULTATION.doubleValue()))
            .andExpect(jsonPath("$.rapportConsultation").value(DEFAULT_RAPPORT_CONSULTATION));
    }

    @Test
    @Transactional
    void getNonExistingConsultation() throws Exception {
        // Get the consultation
        restConsultationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation
        Consultation updatedConsultation = consultationRepository.findById(consultation.getId()).get();
        // Disconnect from session so that the updates on updatedConsultation are not directly saved in db
        em.detach(updatedConsultation);
        updatedConsultation
            .dateComsultation(UPDATED_DATE_COMSULTATION)
            .prixConsultation(UPDATED_PRIX_CONSULTATION)
            .rapportConsultation(UPDATED_RAPPORT_CONSULTATION);

        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateComsultation()).isEqualTo(UPDATED_DATE_COMSULTATION);
        assertThat(testConsultation.getPrixConsultation()).isEqualTo(UPDATED_PRIX_CONSULTATION);
        assertThat(testConsultation.getRapportConsultation()).isEqualTo(UPDATED_RAPPORT_CONSULTATION);
    }

    @Test
    @Transactional
    void putNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consultation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        partialUpdatedConsultation.prixConsultation(UPDATED_PRIX_CONSULTATION);

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateComsultation()).isEqualTo(DEFAULT_DATE_COMSULTATION);
        assertThat(testConsultation.getPrixConsultation()).isEqualTo(UPDATED_PRIX_CONSULTATION);
        assertThat(testConsultation.getRapportConsultation()).isEqualTo(DEFAULT_RAPPORT_CONSULTATION);
    }

    @Test
    @Transactional
    void fullUpdateConsultationWithPatch() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();

        // Update the consultation using partial update
        Consultation partialUpdatedConsultation = new Consultation();
        partialUpdatedConsultation.setId(consultation.getId());

        partialUpdatedConsultation
            .dateComsultation(UPDATED_DATE_COMSULTATION)
            .prixConsultation(UPDATED_PRIX_CONSULTATION)
            .rapportConsultation(UPDATED_RAPPORT_CONSULTATION);

        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultation))
            )
            .andExpect(status().isOk());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
        Consultation testConsultation = consultationList.get(consultationList.size() - 1);
        assertThat(testConsultation.getDateComsultation()).isEqualTo(UPDATED_DATE_COMSULTATION);
        assertThat(testConsultation.getPrixConsultation()).isEqualTo(UPDATED_PRIX_CONSULTATION);
        assertThat(testConsultation.getRapportConsultation()).isEqualTo(UPDATED_RAPPORT_CONSULTATION);
    }

    @Test
    @Transactional
    void patchNonExistingConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consultation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsultation() throws Exception {
        int databaseSizeBeforeUpdate = consultationRepository.findAll().size();
        consultation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consultation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultation in the database
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsultation() throws Exception {
        // Initialize the database
        consultationRepository.saveAndFlush(consultation);

        int databaseSizeBeforeDelete = consultationRepository.findAll().size();

        // Delete the consultation
        restConsultationMockMvc
            .perform(delete(ENTITY_API_URL_ID, consultation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consultation> consultationList = consultationRepository.findAll();
        assertThat(consultationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
