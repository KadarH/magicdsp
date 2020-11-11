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

  saveStorm() {
    return this.http.post<any>(`${this.AUTH_SERVER_ADDRESS}quotes/storm`, {});
  }

  editQuote(quote: any) {
    return this.http.patch<any>(
      `${this.AUTH_SERVER_ADDRESS}quotes/` + quote.id,
      quote
    );
  }

  getQuotes() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=waiting`);
  }

  getQuotesByType(type: string) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}quotes?type=` + type);
  }

  getQuotesByUserStatus(statusId: string) {
    return this.http.get<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/users/status/` + statusId + '/quotes'
    );
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

  deleteQuote(quote: Quote) {
    return this.http.delete(`${this.AUTH_SERVER_ADDRESS}quotes/` + quote.id);
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
