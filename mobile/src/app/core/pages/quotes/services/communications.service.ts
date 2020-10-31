import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommunicationsService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getCommunications(devisId: number) {
    return this.http.get<any>(
      `${this.AUTH_SERVER_ADDRESS}communications/` + devisId
    );
  }

  addCommunication(devisId: number, bodyText: string) {
    return this.http.post<any>(
      `${this.AUTH_SERVER_ADDRESS}communications/` + devisId,
      { body: bodyText }
    );
  }
}
