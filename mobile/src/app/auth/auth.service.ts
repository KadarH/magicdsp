import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { User } from './user';
import { AuthResponse } from './auth-response';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';
  authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  token = '';

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  register(user: User): Observable<void | AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}register`, user)
      .pipe(
        map((res: AuthResponse) => res.data.user.access_token),
        switchMap((token) => {
          return from(Storage.set({ key: TOKEN_KEY, value: token }));
        }),
        tap((_) => {
          this.authSubject.next(true);
        })
      );
  }

  login(user: User): Observable<void | AuthResponse> {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}login`, user).pipe(
      map((res: AuthResponse) => res.data.user.access_token),
      switchMap((token) => {
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      }),
      tap((_) => {
        this.authSubject.next(true);
      })
    );
  }

  async logout() {
    this.authSubject.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  isAuthenticated() {
    console.log(this.authSubject);
    return this.authSubject.value;
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.authSubject.next(true);
    } else {
      this.authSubject.next(false);
    }
  }
}
