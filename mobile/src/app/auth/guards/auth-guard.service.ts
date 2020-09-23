import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    public authenticationService: AuthService
  ) {}

  canActivate(): boolean {
    console.log(this.authenticationService.isAuthenticated());
    if (this.authenticationService.isAuthenticated()) {
      return true;
    } else {
      console.log('malo hada');
      this.router.navigate(['/auth/login']);
      // return '/auth/login';
    }
  }
}
