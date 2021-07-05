import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MedecineComponent } from './list/medecine.component';
import { MedecineDetailComponent } from './detail/medecine-detail.component';
import { MedecineUpdateComponent } from './update/medecine-update.component';
import { MedecineDeleteDialogComponent } from './delete/medecine-delete-dialog.component';
import { MedecineRoutingModule } from './route/medecine-routing.module';

@NgModule({
  imports: [SharedModule, MedecineRoutingModule],
  declarations: [MedecineComponent, MedecineDetailComponent, MedecineUpdateComponent, MedecineDeleteDialogComponent],
  entryComponents: [MedecineDeleteDialogComponent],
})
export class MedecineModule {}
