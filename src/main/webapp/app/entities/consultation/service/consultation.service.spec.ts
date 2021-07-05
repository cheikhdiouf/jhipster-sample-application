import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IConsultation, Consultation } from '../consultation.model';

import { ConsultationService } from './consultation.service';

describe('Service Tests', () => {
  describe('Consultation Service', () => {
    let service: ConsultationService;
    let httpMock: HttpTestingController;
    let elemDefault: IConsultation;
    let expectedResult: IConsultation | IConsultation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConsultationService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateComsultation: currentDate,
        prixConsultation: 0,
        rapportConsultation: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateComsultation: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Consultation', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateComsultation: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateComsultation: currentDate,
          },
          returnedFromService
        );

        service.create(new Consultation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Consultation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateComsultation: currentDate.format(DATE_FORMAT),
            prixConsultation: 1,
            rapportConsultation: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateComsultation: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Consultation', () => {
        const patchObject = Object.assign({}, new Consultation());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateComsultation: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Consultation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateComsultation: currentDate.format(DATE_FORMAT),
            prixConsultation: 1,
            rapportConsultation: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateComsultation: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Consultation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConsultationToCollectionIfMissing', () => {
        it('should add a Consultation to an empty array', () => {
          const consultation: IConsultation = { id: 123 };
          expectedResult = service.addConsultationToCollectionIfMissing([], consultation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(consultation);
        });

        it('should not add a Consultation to an array that contains it', () => {
          const consultation: IConsultation = { id: 123 };
          const consultationCollection: IConsultation[] = [
            {
              ...consultation,
            },
            { id: 456 },
          ];
          expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, consultation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Consultation to an array that doesn't contain it", () => {
          const consultation: IConsultation = { id: 123 };
          const consultationCollection: IConsultation[] = [{ id: 456 }];
          expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, consultation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(consultation);
        });

        it('should add only unique Consultation to an array', () => {
          const consultationArray: IConsultation[] = [{ id: 123 }, { id: 456 }, { id: 74350 }];
          const consultationCollection: IConsultation[] = [{ id: 123 }];
          expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, ...consultationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const consultation: IConsultation = { id: 123 };
          const consultation2: IConsultation = { id: 456 };
          expectedResult = service.addConsultationToCollectionIfMissing([], consultation, consultation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(consultation);
          expect(expectedResult).toContain(consultation2);
        });

        it('should accept null and undefined values', () => {
          const consultation: IConsultation = { id: 123 };
          expectedResult = service.addConsultationToCollectionIfMissing([], null, consultation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(consultation);
        });

        it('should return initial array if no Consultation is added', () => {
          const consultationCollection: IConsultation[] = [{ id: 123 }];
          expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, undefined, null);
          expect(expectedResult).toEqual(consultationCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
