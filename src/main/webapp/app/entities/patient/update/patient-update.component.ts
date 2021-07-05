import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPatient, Patient } from '../patient.model';
import { PatientService } from '../service/patient.service';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';

@Component({
  selector: 'jhi-patient-update',
  templateUrl: './patient-update.component.html',
})
export class PatientUpdateComponent implements OnInit {
  isSaving = false;

  rendezVousCollection: IRendezVous[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    email: [],
    telephone: [],
    adresse: [],
    dateNaissance: [],
    rendezVous: [],
  });

  constructor(
    protected patientService: PatientService,
    protected rendezVousService: RendezVousService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.updateForm(patient);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patient = this.createFromForm();
    if (patient.id !== undefined) {
      this.subscribeToSaveResponse(this.patientService.update(patient));
    } else {
      this.subscribeToSaveResponse(this.patientService.create(patient));
    }
  }

  trackRendezVousById(index: number, item: IRendezVous): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatient>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(patient: IPatient): void {
    this.editForm.patchValue({
      id: patient.id,
      nom: patient.nom,
      prenom: patient.prenom,
      email: patient.email,
      telephone: patient.telephone,
      adresse: patient.adresse,
      dateNaissance: patient.dateNaissance,
      rendezVous: patient.rendezVous,
    });

    this.rendezVousCollection = this.rendezVousService.addRendezVousToCollectionIfMissing(this.rendezVousCollection, patient.rendezVous);
  }

  protected loadRelationshipsOptions(): void {
    this.rendezVousService
      .query({ filter: 'patient-is-null' })
      .pipe(map((res: HttpResponse<IRendezVous[]>) => res.body ?? []))
      .pipe(
        map((rendezVous: IRendezVous[]) =>
          this.rendezVousService.addRendezVousToCollectionIfMissing(rendezVous, this.editForm.get('rendezVous')!.value)
        )
      )
      .subscribe((rendezVous: IRendezVous[]) => (this.rendezVousCollection = rendezVous));
  }

  protected createFromForm(): IPatient {
    return {
      ...new Patient(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      email: this.editForm.get(['email'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      rendezVous: this.editForm.get(['rendezVous'])!.value,
    };
  }
}
