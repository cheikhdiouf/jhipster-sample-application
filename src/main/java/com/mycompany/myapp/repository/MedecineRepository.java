package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Medecine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Medecine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedecineRepository extends JpaRepository<Medecine, Long> {}
