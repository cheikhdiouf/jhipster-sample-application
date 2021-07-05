import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRendezVous, RendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

@Component({
  selector: 'jhi-rendez-vous-update',
  templateUrl: './rendez-vous-update.component.html',
})
export class RendezVousUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateRendezVous: [],
    heureRendezVous: [],
  });

  constructor(protected rendezVousService: RendezVousService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rendezVous }) => {
      if (rendezVous.id === undefined) {
        const today = dayjs().startOf('day');
        rendezVous.heureRendezVous = today;
      }

      this.updateForm(rendezVous);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rendezVous = this.createFromForm();
    if (rendezVous.id !== undefined) {
      this.subscribeToSaveResponse(this.rendezVousService.update(rendezVous));
    } else {
      this.subscribeToSaveResponse(this.rendezVousService.create(rendezVous));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRendezVous>>): void {
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

  protected updateForm(rendezVous: IRendezVous): void {
    this.editForm.patchValue({
      id: rendezVous.id,
      dateRendezVous: rendezVous.dateRendezVous,
      heureRendezVous: rendezVous.heureRendezVous ? rendezVous.heureRendezVous.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IRendezVous {
    return {
      ...new RendezVous(),
      id: this.editForm.get(['id'])!.value,
      dateRendezVous: this.editForm.get(['dateRendezVous'])!.value,
      heureRendezVous: this.editForm.get(['heureRendezVous'])!.value
        ? dayjs(this.editForm.get(['heureRendezVous'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
