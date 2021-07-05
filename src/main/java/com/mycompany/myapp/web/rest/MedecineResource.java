package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Medecine;
import com.mycompany.myapp.repository.MedecineRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Medecine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedecineResource {

    private final Logger log = LoggerFactory.getLogger(MedecineResource.class);

    private static final String ENTITY_NAME = "medecine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedecineRepository medecineRepository;

    public MedecineResource(MedecineRepository medecineRepository) {
        this.medecineRepository = medecineRepository;
    }

    /**
     * {@code POST  /medecines} : Create a new medecine.
     *
     * @param medecine the medecine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medecine, or with status {@code 400 (Bad Request)} if the medecine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medecines")
    public ResponseEntity<Medecine> createMedecine(@RequestBody Medecine medecine) throws URISyntaxException {
        log.debug("REST request to save Medecine : {}", medecine);
        if (medecine.getId() != null) {
            throw new BadRequestAlertException("A new medecine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Medecine result = medecineRepository.save(medecine);
        return ResponseEntity
            .created(new URI("/api/medecines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medecines/:id} : Updates an existing medecine.
     *
     * @param id the id of the medecine to save.
     * @param medecine the medecine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecine,
     * or with status {@code 400 (Bad Request)} if the medecine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medecine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medecines/{id}")
    public ResponseEntity<Medecine> updateMedecine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Medecine medecine
    ) throws URISyntaxException {
        log.debug("REST request to update Medecine : {}, {}", id, medecine);
        if (medecine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Medecine result = medecineRepository.save(medecine);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medecine.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medecines/:id} : Partial updates given fields of an existing medecine, field will ignore if it is null
     *
     * @param id the id of the medecine to save.
     * @param medecine the medecine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecine,
     * or with status {@code 400 (Bad Request)} if the medecine is not valid,
     * or with status {@code 404 (Not Found)} if the medecine is not found,
     * or with status {@code 500 (Internal Server Error)} if the medecine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medecines/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Medecine> partialUpdateMedecine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Medecine medecine
    ) throws URISyntaxException {
        log.debug("REST request to partial update Medecine partially : {}, {}", id, medecine);
        if (medecine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Medecine> result = medecineRepository
            .findById(medecine.getId())
            .map(
                existingMedecine -> {
                    if (medecine.getNom() != null) {
                        existingMedecine.setNom(medecine.getNom());
                    }
                    if (medecine.getPrenom() != null) {
                        existingMedecine.setPrenom(medecine.getPrenom());
                    }
                    if (medecine.getEmail() != null) {
                        existingMedecine.setEmail(medecine.getEmail());
                    }
                    if (medecine.getTelephone() != null) {
                        existingMedecine.setTelephone(medecine.getTelephone());
                    }
                    if (medecine.getSpecialite() != null) {
                        existingMedecine.setSpecialite(medecine.getSpecialite());
                    }

                    return existingMedecine;
                }
            )
            .map(medecineRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medecine.getId().toString())
        );
    }

    /**
     * {@code GET  /medecines} : get all the medecines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medecines in body.
     */
    @GetMapping("/medecines")
    public List<Medecine> getAllMedecines() {
        log.debug("REST request to get all Medecines");
        return medecineRepository.findAll();
    }

    /**
     * {@code GET  /medecines/:id} : get the "id" medecine.
     *
     * @param id the id of the medecine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medecine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medecines/{id}")
    public ResponseEntity<Medecine> getMedecine(@PathVariable Long id) {
        log.debug("REST request to get Medecine : {}", id);
        Optional<Medecine> medecine = medecineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medecine);
    }

    /**
     * {@code DELETE  /medecines/:id} : delete the "id" medecine.
     *
     * @param id the id of the medecine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medecines/{id}")
    public ResponseEntity<Void> deleteMedecine(@PathVariable Long id) {
        log.debug("REST request to delete Medecine : {}", id);
        medecineRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
