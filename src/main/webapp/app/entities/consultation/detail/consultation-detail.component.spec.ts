import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConsultationDetailComponent } from './consultation-detail.component';

describe('Component Tests', () => {
  describe('Consultation Management Detail Component', () => {
    let comp: ConsultationDetailComponent;
    let fixture: ComponentFixture<ConsultationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConsultationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ consultation: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ConsultationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConsultationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load consultation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.consultation).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
