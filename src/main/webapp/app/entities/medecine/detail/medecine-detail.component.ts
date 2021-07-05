import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedecine } from '../medecine.model';

@Component({
  selector: 'jhi-medecine-detail',
  templateUrl: './medecine-detail.component.html',
})
export class MedecineDetailComponent implements OnInit {
  medecine: IMedecine | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecine }) => {
      this.medecine = medecine;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
