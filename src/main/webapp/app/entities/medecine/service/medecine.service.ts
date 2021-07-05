import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedecine, getMedecineIdentifier } from '../medecine.model';

export type EntityResponseType = HttpResponse<IMedecine>;
export type EntityArrayResponseType = HttpResponse<IMedecine[]>;

@Injectable({ providedIn: 'root' })
export class MedecineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medecines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medecine: IMedecine): Observable<EntityResponseType> {
    return this.http.post<IMedecine>(this.resourceUrl, medecine, { observe: 'response' });
  }

  update(medecine: IMedecine): Observable<EntityResponseType> {
    return this.http.put<IMedecine>(`${this.resourceUrl}/${getMedecineIdentifier(medecine) as number}`, medecine, { observe: 'response' });
  }

  partialUpdate(medecine: IMedecine): Observable<EntityResponseType> {
    return this.http.patch<IMedecine>(`${this.resourceUrl}/${getMedecineIdentifier(medecine) as number}`, medecine, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedecine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedecine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedecineToCollectionIfMissing(medecineCollection: IMedecine[], ...medecinesToCheck: (IMedecine | null | undefined)[]): IMedecine[] {
    const medecines: IMedecine[] = medecinesToCheck.filter(isPresent);
    if (medecines.length > 0) {
      const medecineCollectionIdentifiers = medecineCollection.map(medecineItem => getMedecineIdentifier(medecineItem)!);
      const medecinesToAdd = medecines.filter(medecineItem => {
        const medecineIdentifier = getMedecineIdentifier(medecineItem);
        if (medecineIdentifier == null || medecineCollectionIdentifiers.includes(medecineIdentifier)) {
          return false;
        }
        medecineCollectionIdentifiers.push(medecineIdentifier);
        return true;
      });
      return [...medecinesToAdd, ...medecineCollection];
    }
    return medecineCollection;
  }
}
