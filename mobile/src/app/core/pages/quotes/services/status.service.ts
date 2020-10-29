import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getStatus() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}status`);
  }
}
