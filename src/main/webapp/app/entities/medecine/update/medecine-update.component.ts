import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedecine, Medecine } from '../medecine.model';
import { MedecineService } from '../service/medecine.service';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';

@Component({
  selector: 'jhi-medecine-update',
  templateUrl: './medecine-update.component.html',
})
export class MedecineUpdateComponent implements OnInit {
  isSaving = false;

  rendezVousCollection: IRendezVous[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    email: [],
    telephone: [],
    specialite: [],
    rendezVous: [],
  });

  constructor(
    protected medecineService: MedecineService,
    protected rendezVousService: RendezVousService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecine }) => {
      this.updateForm(medecine);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecine = this.createFromForm();
    if (medecine.id !== undefined) {
      this.subscribeToSaveResponse(this.medecineService.update(medecine));
    } else {
      this.subscribeToSaveResponse(this.medecineService.create(medecine));
    }
  }

  trackRendezVousById(index: number, item: IRendezVous): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecine>>): void {
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

  protected updateForm(medecine: IMedecine): void {
    this.editForm.patchValue({
      id: medecine.id,
      nom: medecine.nom,
      prenom: medecine.prenom,
      email: medecine.email,
      telephone: medecine.telephone,
      specialite: medecine.specialite,
      rendezVous: medecine.rendezVous,
    });

    this.rendezVousCollection = this.rendezVousService.addRendezVousToCollectionIfMissing(this.rendezVousCollection, medecine.rendezVous);
  }

  protected loadRelationshipsOptions(): void {
    this.rendezVousService
      .query({ filter: 'medecine-is-null' })
      .pipe(map((res: HttpResponse<IRendezVous[]>) => res.body ?? []))
      .pipe(
        map((rendezVous: IRendezVous[]) =>
          this.rendezVousService.addRendezVousToCollectionIfMissing(rendezVous, this.editForm.get('rendezVous')!.value)
        )
      )
      .subscribe((rendezVous: IRendezVous[]) => (this.rendezVousCollection = rendezVous));
  }

  protected createFromForm(): IMedecine {
    return {
      ...new Medecine(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      email: this.editForm.get(['email'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      specialite: this.editForm.get(['specialite'])!.value,
      rendezVous: this.editForm.get(['rendezVous'])!.value,
    };
  }
}
