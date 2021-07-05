import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';
import { RendezVousDeleteDialogComponent } from '../delete/rendez-vous-delete-dialog.component';

@Component({
  selector: 'jhi-rendez-vous',
  templateUrl: './rendez-vous.component.html',
})
export class RendezVousComponent implements OnInit {
  rendezVous?: IRendezVous[];
  isLoading = false;

  constructor(protected rendezVousService: RendezVousService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.rendezVousService.query().subscribe(
      (res: HttpResponse<IRendezVous[]>) => {
        this.isLoading = false;
        this.rendezVous = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRendezVous): number {
    return item.id!;
  }

  delete(rendezVous: IRendezVous): void {
    const modalRef = this.modalService.open(RendezVousDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rendezVous = rendezVous;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
