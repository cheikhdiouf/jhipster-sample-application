import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';

@Component({
  templateUrl: './consultation-delete-dialog.component.html',
})
export class ConsultationDeleteDialogComponent {
  consultation?: IConsultation;

  constructor(protected consultationService: ConsultationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.consultationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
