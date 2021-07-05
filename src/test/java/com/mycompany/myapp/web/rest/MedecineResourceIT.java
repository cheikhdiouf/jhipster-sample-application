package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Medecine;
import com.mycompany.myapp.repository.MedecineRepository;
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
 * Integration tests for the {@link MedecineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MedecineResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_SPECIALITE = "AAAAAAAAAA";
    private static final String UPDATED_SPECIALITE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/medecines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedecineRepository medecineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedecineMockMvc;

    private Medecine medecine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medecine createEntity(EntityManager em) {
        Medecine medecine = new Medecine()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .email(DEFAULT_EMAIL)
            .telephone(DEFAULT_TELEPHONE)
            .specialite(DEFAULT_SPECIALITE);
        return medecine;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medecine createUpdatedEntity(EntityManager em) {
        Medecine medecine = new Medecine()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .telephone(UPDATED_TELEPHONE)
            .specialite(UPDATED_SPECIALITE);
        return medecine;
    }

    @BeforeEach
    public void initTest() {
        medecine = createEntity(em);
    }

    @Test
    @Transactional
    void createMedecine() throws Exception {
        int databaseSizeBeforeCreate = medecineRepository.findAll().size();
        // Create the Medecine
        restMedecineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecine)))
            .andExpect(status().isCreated());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeCreate + 1);
        Medecine testMedecine = medecineList.get(medecineList.size() - 1);
        assertThat(testMedecine.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testMedecine.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testMedecine.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testMedecine.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testMedecine.getSpecialite()).isEqualTo(DEFAULT_SPECIALITE);
    }

    @Test
    @Transactional
    void createMedecineWithExistingId() throws Exception {
        // Create the Medecine with an existing ID
        medecine.setId(1L);

        int databaseSizeBeforeCreate = medecineRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedecineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecine)))
            .andExpect(status().isBadRequest());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMedecines() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        // Get all the medecineList
        restMedecineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medecine.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].specialite").value(hasItem(DEFAULT_SPECIALITE)));
    }

    @Test
    @Transactional
    void getMedecine() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        // Get the medecine
        restMedecineMockMvc
            .perform(get(ENTITY_API_URL_ID, medecine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medecine.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.specialite").value(DEFAULT_SPECIALITE));
    }

    @Test
    @Transactional
    void getNonExistingMedecine() throws Exception {
        // Get the medecine
        restMedecineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMedecine() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();

        // Update the medecine
        Medecine updatedMedecine = medecineRepository.findById(medecine.getId()).get();
        // Disconnect from session so that the updates on updatedMedecine are not directly saved in db
        em.detach(updatedMedecine);
        updatedMedecine
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .telephone(UPDATED_TELEPHONE)
            .specialite(UPDATED_SPECIALITE);

        restMedecineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedecine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedecine))
            )
            .andExpect(status().isOk());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
        Medecine testMedecine = medecineList.get(medecineList.size() - 1);
        assertThat(testMedecine.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testMedecine.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testMedecine.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMedecine.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testMedecine.getSpecialite()).isEqualTo(UPDATED_SPECIALITE);
    }

    @Test
    @Transactional
    void putNonExistingMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medecine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medecine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medecine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedecineWithPatch() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();

        // Update the medecine using partial update
        Medecine partialUpdatedMedecine = new Medecine();
        partialUpdatedMedecine.setId(medecine.getId());

        partialUpdatedMedecine.email(UPDATED_EMAIL);

        restMedecineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedecine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedecine))
            )
            .andExpect(status().isOk());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
        Medecine testMedecine = medecineList.get(medecineList.size() - 1);
        assertThat(testMedecine.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testMedecine.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testMedecine.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMedecine.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testMedecine.getSpecialite()).isEqualTo(DEFAULT_SPECIALITE);
    }

    @Test
    @Transactional
    void fullUpdateMedecineWithPatch() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();

        // Update the medecine using partial update
        Medecine partialUpdatedMedecine = new Medecine();
        partialUpdatedMedecine.setId(medecine.getId());

        partialUpdatedMedecine
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .email(UPDATED_EMAIL)
            .telephone(UPDATED_TELEPHONE)
            .specialite(UPDATED_SPECIALITE);

        restMedecineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedecine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedecine))
            )
            .andExpect(status().isOk());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
        Medecine testMedecine = medecineList.get(medecineList.size() - 1);
        assertThat(testMedecine.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testMedecine.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testMedecine.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMedecine.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testMedecine.getSpecialite()).isEqualTo(UPDATED_SPECIALITE);
    }

    @Test
    @Transactional
    void patchNonExistingMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medecine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medecine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medecine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedecine() throws Exception {
        int databaseSizeBeforeUpdate = medecineRepository.findAll().size();
        medecine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(medecine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medecine in the database
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedecine() throws Exception {
        // Initialize the database
        medecineRepository.saveAndFlush(medecine);

        int databaseSizeBeforeDelete = medecineRepository.findAll().size();

        // Delete the medecine
        restMedecineMockMvc
            .perform(delete(ENTITY_API_URL_ID, medecine.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Medecine> medecineList = medecineRepository.findAll();
        assertThat(medecineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
