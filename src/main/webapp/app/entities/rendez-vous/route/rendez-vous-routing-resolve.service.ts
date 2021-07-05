import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRendezVous, RendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

@Injectable({ providedIn: 'root' })
export class RendezVousRoutingResolveService implements Resolve<IRendezVous> {
  constructor(protected service: RendezVousService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRendezVous> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rendezVous: HttpResponse<RendezVous>) => {
          if (rendezVous.body) {
            return of(rendezVous.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RendezVous());
  }
}
