package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RendezVous.
 */
@Entity
@Table(name = "rendez_vous")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RendezVous implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_rendez_vous")
    private LocalDate dateRendezVous;

    @Column(name = "heure_rendez_vous")
    private ZonedDateTime heureRendezVous;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RendezVous id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateRendezVous() {
        return this.dateRendezVous;
    }

    public RendezVous dateRendezVous(LocalDate dateRendezVous) {
        this.dateRendezVous = dateRendezVous;
        return this;
    }

    public void setDateRendezVous(LocalDate dateRendezVous) {
        this.dateRendezVous = dateRendezVous;
    }

    public ZonedDateTime getHeureRendezVous() {
        return this.heureRendezVous;
    }

    public RendezVous heureRendezVous(ZonedDateTime heureRendezVous) {
        this.heureRendezVous = heureRendezVous;
        return this;
    }

    public void setHeureRendezVous(ZonedDateTime heureRendezVous) {
        this.heureRendezVous = heureRendezVous;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RendezVous)) {
            return false;
        }
        return id != null && id.equals(((RendezVous) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RendezVous{" +
            "id=" + getId() +
            ", dateRendezVous='" + getDateRendezVous() + "'" +
            ", heureRendezVous='" + getHeureRendezVous() + "'" +
            "}";
    }
}
