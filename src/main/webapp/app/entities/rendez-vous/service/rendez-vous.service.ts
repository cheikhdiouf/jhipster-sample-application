import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRendezVous, getRendezVousIdentifier } from '../rendez-vous.model';

export type EntityResponseType = HttpResponse<IRendezVous>;
export type EntityArrayResponseType = HttpResponse<IRendezVous[]>;

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rendez-vous');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rendezVous: IRendezVous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rendezVous);
    return this.http
      .post<IRendezVous>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(rendezVous: IRendezVous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rendezVous);
    return this.http
      .put<IRendezVous>(`${this.resourceUrl}/${getRendezVousIdentifier(rendezVous) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(rendezVous: IRendezVous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rendezVous);
    return this.http
      .patch<IRendezVous>(`${this.resourceUrl}/${getRendezVousIdentifier(rendezVous) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRendezVous>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRendezVous[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRendezVousToCollectionIfMissing(
    rendezVousCollection: IRendezVous[],
    ...rendezVousToCheck: (IRendezVous | null | undefined)[]
  ): IRendezVous[] {
    const rendezVous: IRendezVous[] = rendezVousToCheck.filter(isPresent);
    if (rendezVous.length > 0) {
      const rendezVousCollectionIdentifiers = rendezVousCollection.map(rendezVousItem => getRendezVousIdentifier(rendezVousItem)!);
      const rendezVousToAdd = rendezVous.filter(rendezVousItem => {
        const rendezVousIdentifier = getRendezVousIdentifier(rendezVousItem);
        if (rendezVousIdentifier == null || rendezVousCollectionIdentifiers.includes(rendezVousIdentifier)) {
          return false;
        }
        rendezVousCollectionIdentifiers.push(rendezVousIdentifier);
        return true;
      });
      return [...rendezVousToAdd, ...rendezVousCollection];
    }
    return rendezVousCollection;
  }

  protected convertDateFromClient(rendezVous: IRendezVous): IRendezVous {
    return Object.assign({}, rendezVous, {
      dateRendezVous: rendezVous.dateRendezVous?.isValid() ? rendezVous.dateRendezVous.format(DATE_FORMAT) : undefined,
      heureRendezVous: rendezVous.heureRendezVous?.isValid() ? rendezVous.heureRendezVous.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateRendezVous = res.body.dateRendezVous ? dayjs(res.body.dateRendezVous) : undefined;
      res.body.heureRendezVous = res.body.heureRendezVous ? dayjs(res.body.heureRendezVous) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((rendezVous: IRendezVous) => {
        rendezVous.dateRendezVous = rendezVous.dateRendezVous ? dayjs(rendezVous.dateRendezVous) : undefined;
        rendezVous.heureRendezVous = rendezVous.heureRendezVous ? dayjs(rendezVous.heureRendezVous) : undefined;
      });
    }
    return res;
  }
}
