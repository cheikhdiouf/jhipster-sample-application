import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecine } from '../medecine.model';
import { MedecineService } from '../service/medecine.service';

@Component({
  templateUrl: './medecine-delete-dialog.component.html',
})
export class MedecineDeleteDialogComponent {
  medecine?: IMedecine;

  constructor(protected medecineService: MedecineService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medecineService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
