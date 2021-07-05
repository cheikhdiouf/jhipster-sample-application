import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConsultationService } from '../service/consultation.service';

import { ConsultationComponent } from './consultation.component';

describe('Component Tests', () => {
  describe('Consultation Management Component', () => {
    let comp: ConsultationComponent;
    let fixture: ComponentFixture<ConsultationComponent>;
    let service: ConsultationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultationComponent],
      })
        .overrideTemplate(ConsultationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ConsultationService);

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
      expect(comp.consultations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
