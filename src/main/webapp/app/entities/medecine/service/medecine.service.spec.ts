import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMedecine, Medecine } from '../medecine.model';

import { MedecineService } from './medecine.service';

describe('Service Tests', () => {
  describe('Medecine Service', () => {
    let service: MedecineService;
    let httpMock: HttpTestingController;
    let elemDefault: IMedecine;
    let expectedResult: IMedecine | IMedecine[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MedecineService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        prenom: 'AAAAAAA',
        email: 'AAAAAAA',
        telephone: 'AAAAAAA',
        specialite: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Medecine', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Medecine()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Medecine', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            prenom: 'BBBBBB',
            email: 'BBBBBB',
            telephone: 'BBBBBB',
            specialite: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Medecine', () => {
        const patchObject = Object.assign(
          {
            prenom: 'BBBBBB',
            specialite: 'BBBBBB',
          },
          new Medecine()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Medecine', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            prenom: 'BBBBBB',
            email: 'BBBBBB',
            telephone: 'BBBBBB',
            specialite: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Medecine', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMedecineToCollectionIfMissing', () => {
        it('should add a Medecine to an empty array', () => {
          const medecine: IMedecine = { id: 123 };
          expectedResult = service.addMedecineToCollectionIfMissing([], medecine);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecine);
        });

        it('should not add a Medecine to an array that contains it', () => {
          const medecine: IMedecine = { id: 123 };
          const medecineCollection: IMedecine[] = [
            {
              ...medecine,
            },
            { id: 456 },
          ];
          expectedResult = service.addMedecineToCollectionIfMissing(medecineCollection, medecine);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Medecine to an array that doesn't contain it", () => {
          const medecine: IMedecine = { id: 123 };
          const medecineCollection: IMedecine[] = [{ id: 456 }];
          expectedResult = service.addMedecineToCollectionIfMissing(medecineCollection, medecine);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecine);
        });

        it('should add only unique Medecine to an array', () => {
          const medecineArray: IMedecine[] = [{ id: 123 }, { id: 456 }, { id: 6722 }];
          const medecineCollection: IMedecine[] = [{ id: 123 }];
          expectedResult = service.addMedecineToCollectionIfMissing(medecineCollection, ...medecineArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const medecine: IMedecine = { id: 123 };
          const medecine2: IMedecine = { id: 456 };
          expectedResult = service.addMedecineToCollectionIfMissing([], medecine, medecine2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecine);
          expect(expectedResult).toContain(medecine2);
        });

        it('should accept null and undefined values', () => {
          const medecine: IMedecine = { id: 123 };
          expectedResult = service.addMedecineToCollectionIfMissing([], null, medecine, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecine);
        });

        it('should return initial array if no Medecine is added', () => {
          const medecineCollection: IMedecine[] = [{ id: 123 }];
          expectedResult = service.addMedecineToCollectionIfMissing(medecineCollection, undefined, null);
          expect(expectedResult).toEqual(medecineCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
