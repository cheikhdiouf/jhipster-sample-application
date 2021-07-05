import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RendezVousComponent } from '../list/rendez-vous.component';
import { RendezVousDetailComponent } from '../detail/rendez-vous-detail.component';
import { RendezVousUpdateComponent } from '../update/rendez-vous-update.component';
import { RendezVousRoutingResolveService } from './rendez-vous-routing-resolve.service';

const rendezVousRoute: Routes = [
  {
    path: '',
    component: RendezVousComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RendezVousDetailComponent,
    resolve: {
      rendezVous: RendezVousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RendezVousUpdateComponent,
    resolve: {
      rendezVous: RendezVousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RendezVousUpdateComponent,
    resolve: {
      rendezVous: RendezVousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rendezVousRoute)],
  exports: [RouterModule],
})
export class RendezVousRoutingModule {}
