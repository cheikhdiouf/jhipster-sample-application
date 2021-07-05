import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsultation, getConsultationIdentifier } from '../consultation.model';

export type EntityResponseType = HttpResponse<IConsultation>;
export type EntityArrayResponseType = HttpResponse<IConsultation[]>;

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/consultations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(consultation: IConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .post<IConsultation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(consultation: IConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .put<IConsultation>(`${this.resourceUrl}/${getConsultationIdentifier(consultation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(consultation: IConsultation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultation);
    return this.http
      .patch<IConsultation>(`${this.resourceUrl}/${getConsultationIdentifier(consultation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConsultation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConsultation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConsultationToCollectionIfMissing(
    consultationCollection: IConsultation[],
    ...consultationsToCheck: (IConsultation | null | undefined)[]
  ): IConsultation[] {
    const consultations: IConsultation[] = consultationsToCheck.filter(isPresent);
    if (consultations.length > 0) {
      const consultationCollectionIdentifiers = consultationCollection.map(
        consultationItem => getConsultationIdentifier(consultationItem)!
      );
      const consultationsToAdd = consultations.filter(consultationItem => {
        const consultationIdentifier = getConsultationIdentifier(consultationItem);
        if (consultationIdentifier == null || consultationCollectionIdentifiers.includes(consultationIdentifier)) {
          return false;
        }
        consultationCollectionIdentifiers.push(consultationIdentifier);
        return true;
      });
      return [...consultationsToAdd, ...consultationCollection];
    }
    return consultationCollection;
  }

  protected convertDateFromClient(consultation: IConsultation): IConsultation {
    return Object.assign({}, consultation, {
      dateComsultation: consultation.dateComsultation?.isValid() ? consultation.dateComsultation.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateComsultation = res.body.dateComsultation ? dayjs(res.body.dateComsultation) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((consultation: IConsultation) => {
        consultation.dateComsultation = consultation.dateComsultation ? dayjs(consultation.dateComsultation) : undefined;
      });
    }
    return res;
  }
}
