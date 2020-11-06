import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';

  constructor(private http: HttpClient) {}

  getNotifications() {
    return this.http.get<any>(`${this.AUTH_SERVER_ADDRESS}notifications`);
  }

  markNotificationsAsRead(notification: any) {
    return this.http.patch<any>(
      `${this.AUTH_SERVER_ADDRESS}notifications/` + notification.id + '/read',
      notification
    );
  }
}
