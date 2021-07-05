import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConsultationComponent } from './list/consultation.component';
import { ConsultationDetailComponent } from './detail/consultation-detail.component';
import { ConsultationUpdateComponent } from './update/consultation-update.component';
import { ConsultationDeleteDialogComponent } from './delete/consultation-delete-dialog.component';
import { ConsultationRoutingModule } from './route/consultation-routing.module';

@NgModule({
  imports: [SharedModule, ConsultationRoutingModule],
  declarations: [ConsultationComponent, ConsultationDetailComponent, ConsultationUpdateComponent, ConsultationDeleteDialogComponent],
  entryComponents: [ConsultationDeleteDialogComponent],
})
export class ConsultationModule {}
