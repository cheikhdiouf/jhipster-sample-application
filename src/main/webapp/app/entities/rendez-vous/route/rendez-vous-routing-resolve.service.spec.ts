jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRendezVous, RendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

import { RendezVousRoutingResolveService } from './rendez-vous-routing-resolve.service';

describe('Service Tests', () => {
  describe('RendezVous routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RendezVousRoutingResolveService;
    let service: RendezVousService;
    let resultRendezVous: IRendezVous | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RendezVousRoutingResolveService);
      service = TestBed.inject(RendezVousService);
      resultRendezVous = undefined;
    });

    describe('resolve', () => {
      it('should return IRendezVous returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRendezVous = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRendezVous).toEqual({ id: 123 });
      });

      it('should return new IRendezVous if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRendezVous = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRendezVous).toEqual(new RendezVous());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RendezVous })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRendezVous = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRendezVous).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
