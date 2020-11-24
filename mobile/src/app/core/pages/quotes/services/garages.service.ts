import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/garages`,
      garage
    );
  }

  editGarage(garage: any) {
    return this.http.patch<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/garages/` + garage.id,
      garage
    );
  }

  deleteGarage(garage: any) {
    return this.http.delete<any>(
      `${this.AUTH_SERVER_ADDRESS}admin/garages/` + garage.id
    );
  }

  checkAvailabilities(quoteId: number, garageId: number, date: string) {
    let params = new HttpParams();

    params = params.append('date', date);
    params = params.append('quote_id', quoteId + '');

    return this.http.get<any>(
      `${this.AUTH_SERVER_ADDRESS}garages/` + garageId + '/availabilities',
      { params }
    );
  }

  fixMeeting(
    quoteId: number,
    garageId: number,
    dateSelected: string,
    hourSelected: string
  ) {
    return this.http.patch(
      `${this.AUTH_SERVER_ADDRESS}quotes/` + quoteId + '/meetings',
      {
        date: dateSelected,
        hour: hourSelected,
        garage_id: garageId,
      }
    );
  }
}
