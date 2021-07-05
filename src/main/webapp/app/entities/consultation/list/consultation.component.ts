import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';
import { ConsultationDeleteDialogComponent } from '../delete/consultation-delete-dialog.component';

@Component({
  selector: 'jhi-consultation',
  templateUrl: './consultation.component.html',
})
export class ConsultationComponent implements OnInit {
  consultations?: IConsultation[];
  isLoading = false;

  constructor(protected consultationService: ConsultationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.consultationService.query().subscribe(
      (res: HttpResponse<IConsultation[]>) => {
        this.isLoading = false;
        this.consultations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConsultation): number {
    return item.id!;
  }

  delete(consultation: IConsultation): void {
    const modalRef = this.modalService.open(ConsultationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.consultation = consultation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
