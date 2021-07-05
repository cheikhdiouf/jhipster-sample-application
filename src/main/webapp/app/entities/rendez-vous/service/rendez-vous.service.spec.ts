import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRendezVous, RendezVous } from '../rendez-vous.model';

import { RendezVousService } from './rendez-vous.service';

describe('Service Tests', () => {
  describe('RendezVous Service', () => {
    let service: RendezVousService;
    let httpMock: HttpTestingController;
    let elemDefault: IRendezVous;
    let expectedResult: IRendezVous | IRendezVous[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RendezVousService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateRendezVous: currentDate,
        heureRendezVous: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateRendezVous: currentDate.format(DATE_FORMAT),
            heureRendezVous: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a RendezVous', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateRendezVous: currentDate.format(DATE_FORMAT),
            heureRendezVous: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateRendezVous: currentDate,
            heureRendezVous: currentDate,
          },
          returnedFromService
        );

        service.create(new RendezVous()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RendezVous', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateRendezVous: currentDate.format(DATE_FORMAT),
            heureRendezVous: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateRendezVous: currentDate,
            heureRendezVous: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RendezVous', () => {
        const patchObject = Object.assign({}, new RendezVous());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateRendezVous: currentDate,
            heureRendezVous: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RendezVous', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateRendezVous: currentDate.format(DATE_FORMAT),
            heureRendezVous: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateRendezVous: currentDate,
            heureRendezVous: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a RendezVous', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRendezVousToCollectionIfMissing', () => {
        it('should add a RendezVous to an empty array', () => {
          const rendezVous: IRendezVous = { id: 123 };
          expectedResult = service.addRendezVousToCollectionIfMissing([], rendezVous);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rendezVous);
        });

        it('should not add a RendezVous to an array that contains it', () => {
          const rendezVous: IRendezVous = { id: 123 };
          const rendezVousCollection: IRendezVous[] = [
            {
              ...rendezVous,
            },
            { id: 456 },
          ];
          expectedResult = service.addRendezVousToCollectionIfMissing(rendezVousCollection, rendezVous);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RendezVous to an array that doesn't contain it", () => {
          const rendezVous: IRendezVous = { id: 123 };
          const rendezVousCollection: IRendezVous[] = [{ id: 456 }];
          expectedResult = service.addRendezVousToCollectionIfMissing(rendezVousCollection, rendezVous);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rendezVous);
        });

        it('should add only unique RendezVous to an array', () => {
          const rendezVousArray: IRendezVous[] = [{ id: 123 }, { id: 456 }, { id: 63321 }];
          const rendezVousCollection: IRendezVous[] = [{ id: 123 }];
          expectedResult = service.addRendezVousToCollectionIfMissing(rendezVousCollection, ...rendezVousArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rendezVous: IRendezVous = { id: 123 };
          const rendezVous2: IRendezVous = { id: 456 };
          expectedResult = service.addRendezVousToCollectionIfMissing([], rendezVous, rendezVous2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rendezVous);
          expect(expectedResult).toContain(rendezVous2);
        });

        it('should accept null and undefined values', () => {
          const rendezVous: IRendezVous = { id: 123 };
          expectedResult = service.addRendezVousToCollectionIfMissing([], null, rendezVous, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rendezVous);
        });

        it('should return initial array if no RendezVous is added', () => {
          const rendezVousCollection: IRendezVous[] = [{ id: 123 }];
          expectedResult = service.addRendezVousToCollectionIfMissing(rendezVousCollection, undefined, null);
          expect(expectedResult).toEqual(rendezVousCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
