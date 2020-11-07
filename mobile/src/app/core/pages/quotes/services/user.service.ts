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
}
