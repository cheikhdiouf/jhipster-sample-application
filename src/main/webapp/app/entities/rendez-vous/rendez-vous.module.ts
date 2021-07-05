import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RendezVousComponent } from './list/rendez-vous.component';
import { RendezVousDetailComponent } from './detail/rendez-vous-detail.component';
import { RendezVousUpdateComponent } from './update/rendez-vous-update.component';
import { RendezVousDeleteDialogComponent } from './delete/rendez-vous-delete-dialog.component';
import { RendezVousRoutingModule } from './route/rendez-vous-routing.module';

@NgModule({
  imports: [SharedModule, RendezVousRoutingModule],
  declarations: [RendezVousComponent, RendezVousDetailComponent, RendezVousUpdateComponent, RendezVousDeleteDialogComponent],
  entryComponents: [RendezVousDeleteDialogComponent],
})
export class RendezVousModule {}
