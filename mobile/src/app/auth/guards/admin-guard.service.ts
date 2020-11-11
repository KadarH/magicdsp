import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    public authenticationService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authenticationService.getUser().admin) {
      return true;
    } else {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }
}
