import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRendezVous } from '../rendez-vous.model';

@Component({
  selector: 'jhi-rendez-vous-detail',
  templateUrl: './rendez-vous-detail.component.html',
})
export class RendezVousDetailComponent implements OnInit {
  rendezVous: IRendezVous | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rendezVous }) => {
      this.rendezVous = rendezVous;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
