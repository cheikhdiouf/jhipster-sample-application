jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RendezVousService } from '../service/rendez-vous.service';
import { IRendezVous, RendezVous } from '../rendez-vous.model';

import { RendezVousUpdateComponent } from './rendez-vous-update.component';

describe('Component Tests', () => {
  describe('RendezVous Management Update Component', () => {
    let comp: RendezVousUpdateComponent;
    let fixture: ComponentFixture<RendezVousUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rendezVousService: RendezVousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RendezVousUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RendezVousUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RendezVousUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rendezVousService = TestBed.inject(RendezVousService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const rendezVous: IRendezVous = { id: 456 };

        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rendezVous));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = { id: 123 };
        jest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rendezVous }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rendezVousService.update).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = new RendezVous();
        jest.spyOn(rendezVousService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rendezVous }));
        saveSubject.complete();

        // THEN
        expect(rendezVousService.create).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = { id: 123 };
        jest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rendezVousService.update).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
