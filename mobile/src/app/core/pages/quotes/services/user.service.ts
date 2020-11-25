import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getQuotesByTypeOfUser(id: number) {
    return this.http.get<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/users/status/` + id + '/quotes'
    );
  }

  deleteUser(user: any) {
    return this.http.delete<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/users/` + user.id
    );
  }

  editUser(userId: any, user: any) {
    return this.http.patch<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/users/` + userId,
      {
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        phone_number: user.phone_number,
        email: user.email,
        vat_number: user.vat_number ? user.vat_number : '',
      }
    );
  }

  getAllUsers() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}admin/users`);
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}admin/users/` + id);
  }
}
