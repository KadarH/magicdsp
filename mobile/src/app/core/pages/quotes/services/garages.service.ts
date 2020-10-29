import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GaragesService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getGarages() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}garages`);
  }

  getGarage(garageId: any) {
    return this.http.get<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/garages/` + garageId
    );
  }

  addGarage(garage: any) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}garages`);
  }
}
