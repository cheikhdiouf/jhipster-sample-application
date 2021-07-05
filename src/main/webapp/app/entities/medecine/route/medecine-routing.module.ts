import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedecineComponent } from '../list/medecine.component';
import { MedecineDetailComponent } from '../detail/medecine-detail.component';
import { MedecineUpdateComponent } from '../update/medecine-update.component';
import { MedecineRoutingResolveService } from './medecine-routing-resolve.service';

const medecineRoute: Routes = [
  {
    path: '',
    component: MedecineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedecineDetailComponent,
    resolve: {
      medecine: MedecineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedecineUpdateComponent,
    resolve: {
      medecine: MedecineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedecineUpdateComponent,
    resolve: {
      medecine: MedecineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medecineRoute)],
  exports: [RouterModule],
})
export class MedecineRoutingModule {}
