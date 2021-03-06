import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarquesService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getBrands() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}brands`);
  }
}
