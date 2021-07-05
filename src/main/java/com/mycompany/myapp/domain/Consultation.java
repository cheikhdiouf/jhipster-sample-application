package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consultation.
 */
@Entity
@Table(name = "consultation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_comsultation")
    private LocalDate dateComsultation;

    @Column(name = "prix_consultation")
    private Double prixConsultation;

    @Column(name = "rapport_consultation")
    private String rapportConsultation;

    @OneToOne
    @JoinColumn(unique = true)
    private RendezVous rendezVous;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Consultation id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateComsultation() {
        return this.dateComsultation;
    }

    public Consultation dateComsultation(LocalDate dateComsultation) {
        this.dateComsultation = dateComsultation;
        return this;
    }

    public void setDateComsultation(LocalDate dateComsultation) {
        this.dateComsultation = dateComsultation;
    }

    public Double getPrixConsultation() {
        return this.prixConsultation;
    }

    public Consultation prixConsultation(Double prixConsultation) {
        this.prixConsultation = prixConsultation;
        return this;
    }

    public void setPrixConsultation(Double prixConsultation) {
        this.prixConsultation = prixConsultation;
    }

    public String getRapportConsultation() {
        return this.rapportConsultation;
    }

    public Consultation rapportConsultation(String rapportConsultation) {
        this.rapportConsultation = rapportConsultation;
        return this;
    }

    public void setRapportConsultation(String rapportConsultation) {
        this.rapportConsultation = rapportConsultation;
    }

    public RendezVous getRendezVous() {
        return this.rendezVous;
    }

    public Consultation rendezVous(RendezVous rendezVous) {
        this.setRendezVous(rendezVous);
        return this;
    }

    public void setRendezVous(RendezVous rendezVous) {
        this.rendezVous = rendezVous;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consultation)) {
            return false;
        }
        return id != null && id.equals(((Consultation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consultation{" +
            "id=" + getId() +
            ", dateComsultation='" + getDateComsultation() + "'" +
            ", prixConsultation=" + getPrixConsultation() +
            ", rapportConsultation='" + getRapportConsultation() + "'" +
            "}";
    }
}
