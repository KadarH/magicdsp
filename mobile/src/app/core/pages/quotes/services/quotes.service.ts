import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getQuotes() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=waiting`);
  }

  getQuotesByType(type: string) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=` + type);
  }
}
