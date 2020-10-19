import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(private authService: AuthService) {}

  resolve() {
    return this.authService.getUser();
  }
}
