jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConsultationService } from '../service/consultation.service';
import { IConsultation, Consultation } from '../consultation.model';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';

import { ConsultationUpdateComponent } from './consultation-update.component';

describe('Component Tests', () => {
  describe('Consultation Management Update Component', () => {
    let comp: ConsultationUpdateComponent;
    let fixture: ComponentFixture<ConsultationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let consultationService: ConsultationService;
    let rendezVousService: RendezVousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConsultationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      consultationService = TestBed.inject(ConsultationService);
      rendezVousService = TestBed.inject(RendezVousService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call rendezVous query and add missing value', () => {
        const consultation: IConsultation = { id: 456 };
        const rendezVous: IRendezVous = { id: 62564 };
        consultation.rendezVous = rendezVous;

        const rendezVousCollection: IRendezVous[] = [{ id: 80143 }];
        jest.spyOn(rendezVousService, 'query').mockReturnValue(of(new HttpResponse({ body: rendezVousCollection })));
        const expectedCollection: IRendezVous[] = [rendezVous, ...rendezVousCollection];
        jest.spyOn(rendezVousService, 'addRendezVousToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        expect(rendezVousService.query).toHaveBeenCalled();
        expect(rendezVousService.addRendezVousToCollectionIfMissing).toHaveBeenCalledWith(rendezVousCollection, rendezVous);
        expect(comp.rendezVousCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const consultation: IConsultation = { id: 456 };
        const rendezVous: IRendezVous = { id: 49559 };
        consultation.rendezVous = rendezVous;

        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(consultation));
        expect(comp.rendezVousCollection).toContain(rendezVous);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = { id: 123 };
        jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(consultationService.update).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = new Consultation();
        jest.spyOn(consultationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultation }));
        saveSubject.complete();

        // THEN
        expect(consultationService.create).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = { id: 123 };
        jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(consultationService.update).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRendezVousById', () => {
        it('Should return tracked RendezVous primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRendezVousById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
