import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedecineService } from '../service/medecine.service';

import { MedecineComponent } from './medecine.component';

describe('Component Tests', () => {
  describe('Medecine Management Component', () => {
    let comp: MedecineComponent;
    let fixture: ComponentFixture<MedecineComponent>;
    let service: MedecineService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecineComponent],
      })
        .overrideTemplate(MedecineComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecineComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MedecineService);

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
      expect(comp.medecines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
