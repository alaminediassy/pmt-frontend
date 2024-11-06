import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    const token = this.authService.getToken();

    if (token) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
