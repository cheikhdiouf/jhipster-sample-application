import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedecine, Medecine } from '../medecine.model';
import { MedecineService } from '../service/medecine.service';

@Injectable({ providedIn: 'root' })
export class MedecineRoutingResolveService implements Resolve<IMedecine> {
  constructor(protected service: MedecineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedecine> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medecine: HttpResponse<Medecine>) => {
          if (medecine.body) {
            return of(medecine.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Medecine());
  }
}
