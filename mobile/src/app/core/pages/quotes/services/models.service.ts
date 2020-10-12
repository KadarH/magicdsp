import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getModels(id: number) {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}brands/` + id);
  }
}
