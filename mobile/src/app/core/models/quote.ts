import { User } from './user';

// tslint:disable variable-name
export class Quote {
  accepted: number;
  brand: string;
  can_edit: number;
  chassis_number: string;
  created_at: string;
  doors: string;
  garage_id: null;
  id: number;
  meeting_date: any;
  model: string;
  plate_number: string;
  refused: number;
  storm: number;
  tasks: any[];
  updated_at: string;
  user_id: number;
  waiting: number;
  year: string;
  price: number;
  duration: number;
  user: User;
}

export enum Places {
  CAPOT = 'Capot',
  PAVILLON = 'Pavillon',
}
