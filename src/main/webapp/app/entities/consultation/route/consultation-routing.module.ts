import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConsultationComponent } from '../list/consultation.component';
import { ConsultationDetailComponent } from '../detail/consultation-detail.component';
import { ConsultationUpdateComponent } from '../update/consultation-update.component';
import { ConsultationRoutingResolveService } from './consultation-routing-resolve.service';

const consultationRoute: Routes = [
  {
    path: '',
    component: ConsultationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConsultationDetailComponent,
    resolve: {
      consultation: ConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConsultationUpdateComponent,
    resolve: {
      consultation: ConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConsultationUpdateComponent,
    resolve: {
      consultation: ConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(consultationRoute)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
