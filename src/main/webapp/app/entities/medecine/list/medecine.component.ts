import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecine } from '../medecine.model';
import { MedecineService } from '../service/medecine.service';
import { MedecineDeleteDialogComponent } from '../delete/medecine-delete-dialog.component';

@Component({
  selector: 'jhi-medecine',
  templateUrl: './medecine.component.html',
})
export class MedecineComponent implements OnInit {
  medecines?: IMedecine[];
  isLoading = false;

  constructor(protected medecineService: MedecineService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medecineService.query().subscribe(
      (res: HttpResponse<IMedecine[]>) => {
        this.isLoading = false;
        this.medecines = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedecine): number {
    return item.id!;
  }

  delete(medecine: IMedecine): void {
    const modalRef = this.modalService.open(MedecineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medecine = medecine;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
