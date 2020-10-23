import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AuthResponse } from 'src/app/auth/auth-response';
const { Storage } = Plugins;

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class HttpConfigInterceptor implements HttpInterceptor {
  protected url = 'https://api.magic-dsp.com/api/';

  constructor(private alertController: AlertController) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(Storage.get({ key: TOKEN_KEY })).pipe(
      switchMap((token) => {
        if (token.value) {
          request = request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + token.value
            ),
          });
        }

        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json'),
          });
        } else if (request.headers.get('Content-Type') === 'multipart') {
          request = request.clone({
            headers: request.headers.delete('Content-Type'),
          });
        }

        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do nothing for now
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            const status = error.status;
            const reason =
              error && error.error && error.error.reason
                ? error.error.reason
                : '';

            this.presentAlert(status, reason);
            return throwError(error);
          })
        );
      })
    );
  }

  async presentAlert(status, reason) {
    const alert = await this.alertController.create({
      header: status + ' Error',
      subHeader: 'Subtitle',
      message: reason,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
