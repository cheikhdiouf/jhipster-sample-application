import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

@Component({
  templateUrl: './rendez-vous-delete-dialog.component.html',
})
export class RendezVousDeleteDialogComponent {
  rendezVous?: IRendezVous;

  constructor(protected rendezVousService: RendezVousService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rendezVousService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
