import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { User } from './user';
import { AuthResponse } from './auth-response';
import { OneSignalService } from '../shared/one-signal.service';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_SERVER_ADDRESS = 'https://api.magic-dsp.com/api/';
  authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private user: User;
  token = '';

  constructor(
    private httpClient: HttpClient,
    private oneSignalService: OneSignalService
  ) {
    this.loadToken();
    this.loadUser();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.authSubject.next(true);
    } else {
      this.authSubject.next(false);
    }
  }

  async loadUser() {
    const user = await Storage.get({ key: 'user' });
    this.user = user && user.value ? JSON.parse(user.value) : null;
  }

  login(user: User): Observable<void | AuthResponse> {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}login`, user).pipe(
      map((res: AuthResponse) => {
        this.user = res && res.data ? res.data.user : null;
        this.oneSignalService.setupPush(this.user.id);
        Storage.set({ key: 'user', value: JSON.stringify(res.data.user) });
        return res.data.token;
      }),
      switchMap((token) => {
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      }),
      tap((_) => {
        this.authSubject.next(true);
      })
    );
  }

  register(user: User): Observable<void | AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}register`, user)
      .pipe(
        map((res: AuthResponse) => res.data),
        switchMap((data) => {
          Storage.set({ key: 'user', value: JSON.stringify(data.user) });
          return from(Storage.set({ key: TOKEN_KEY, value: data.token }));
        }),
        tap((_) => {
          this.authSubject.next(true);
        })
      );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  isAuthenticated() {
    return this.authSubject.value;
  }

  async logout(): Promise<void> {
    this.authSubject.next(false);
    return await Storage.remove({ key: TOKEN_KEY });
  }

  getUser(): any {
    return this.user;
  }
}
