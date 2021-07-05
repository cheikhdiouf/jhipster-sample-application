import * as dayjs from 'dayjs';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';

export interface IConsultation {
  id?: number;
  dateComsultation?: dayjs.Dayjs | null;
  prixConsultation?: number | null;
  rapportConsultation?: string | null;
  rendezVous?: IRendezVous | null;
}

export class Consultation implements IConsultation {
  constructor(
    public id?: number,
    public dateComsultation?: dayjs.Dayjs | null,
    public prixConsultation?: number | null,
    public rapportConsultation?: string | null,
    public rendezVous?: IRendezVous | null
  ) {}
}

export function getConsultationIdentifier(consultation: IConsultation): number | undefined {
  return consultation.id;
}
