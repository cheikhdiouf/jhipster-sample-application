import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RendezVousService } from '../service/rendez-vous.service';

import { RendezVousComponent } from './rendez-vous.component';

describe('Component Tests', () => {
  describe('RendezVous Management Component', () => {
    let comp: RendezVousComponent;
    let fixture: ComponentFixture<RendezVousComponent>;
    let service: RendezVousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RendezVousComponent],
      })
        .overrideTemplate(RendezVousComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RendezVousComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RendezVousService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.rendezVous?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
