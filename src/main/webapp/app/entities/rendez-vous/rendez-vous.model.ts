import * as dayjs from 'dayjs';

export interface IRendezVous {
  id?: number;
  dateRendezVous?: dayjs.Dayjs | null;
  heureRendezVous?: dayjs.Dayjs | null;
}

export class RendezVous implements IRendezVous {
  constructor(public id?: number, public dateRendezVous?: dayjs.Dayjs | null, public heureRendezVous?: dayjs.Dayjs | null) {}
}

export function getRendezVousIdentifier(rendezVous: IRendezVous): number | undefined {
  return rendezVous.id;
}
