export class Quote {
  marque: string;
  modele: string;
  immatriculation: string;
  doorNumber: string;
  picture: string;
  comments: string;
  place: Places;
}

export enum Places {
  CAPOT = 'Capot',
  PAVILLON = 'Pavillon',
}
