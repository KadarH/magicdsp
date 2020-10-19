export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  admin: boolean;
  firstname: string;
  lastname: string;
  phone_number: string;
  status?: {
    id: number;
    name: string;
    topbar_background: string;
  };
  status_id: number;
  vat_number: string;
}
