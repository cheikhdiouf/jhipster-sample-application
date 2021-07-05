import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RendezVousDetailComponent } from './rendez-vous-detail.component';

describe('Component Tests', () => {
  describe('RendezVous Management Detail Component', () => {
    let comp: RendezVousDetailComponent;
    let fixture: ComponentFixture<RendezVousDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RendezVousDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rendezVous: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RendezVousDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RendezVousDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rendezVous on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rendezVous).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
