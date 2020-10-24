import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Quote } from 'src/app/core/models/quote';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  saveQuote(quote: any) {
    return this.http.post<any>(`${this.AUTH_SERVER_ADDRESS}quotes`, quote);
  }

  getQuotes() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=waiting`);
  }

  getQuotesByType(type: string) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=` + type);
  }

  getQuote(id: number) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes/` + id);
  }

  refuseQuote(quote: Quote) {
    return this.http.patch(
      `${this.AUTH_SERVER_ADDRESS}quotes/` + quote.id + '/refuse',
      quote
    );
  }
  uploadPhoto(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.AUTH_SERVER_ADDRESS}tasks/upload/picture`,
      formData,
      { headers: { 'Content-Type': 'multipart' } }
    );
  }
}
