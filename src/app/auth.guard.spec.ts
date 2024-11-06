import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { Observable, of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if token exists', (done) => {
    authService.getToken.and.returnValue('mockToken');
    
    const canMatchResult = guard.canMatch({} as any, []);
    if (canMatchResult instanceof Observable) {
      canMatchResult.subscribe(result => {
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(canMatchResult).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    }
  });
  

  it('should deny access and redirect to login if no token', () => {
    authService.getToken.and.returnValue(null); // Mock no token

    const canMatchResult = guard.canMatch({} as any, []);
    expect(canMatchResult).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
