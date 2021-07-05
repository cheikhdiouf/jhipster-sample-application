import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedecineDetailComponent } from './medecine-detail.component';

describe('Component Tests', () => {
  describe('Medecine Management Detail Component', () => {
    let comp: MedecineDetailComponent;
    let fixture: ComponentFixture<MedecineDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MedecineDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ medecine: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MedecineDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedecineDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medecine on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medecine).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
