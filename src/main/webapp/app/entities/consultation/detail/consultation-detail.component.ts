import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsultation } from '../consultation.model';

@Component({
  selector: 'jhi-consultation-detail',
  templateUrl: './consultation-detail.component.html',
})
export class ConsultationDetailComponent implements OnInit {
  consultation: IConsultation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultation }) => {
      this.consultation = consultation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
