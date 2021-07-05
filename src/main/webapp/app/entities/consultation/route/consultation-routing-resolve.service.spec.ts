jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IConsultation, Consultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';

import { ConsultationRoutingResolveService } from './consultation-routing-resolve.service';

describe('Service Tests', () => {
  describe('Consultation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ConsultationRoutingResolveService;
    let service: ConsultationService;
    let resultConsultation: IConsultation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ConsultationRoutingResolveService);
      service = TestBed.inject(ConsultationService);
      resultConsultation = undefined;
    });

    describe('resolve', () => {
      it('should return IConsultation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConsultation).toEqual({ id: 123 });
      });

      it('should return new IConsultation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultConsultation).toEqual(new Consultation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Consultation })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConsultation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConsultation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
