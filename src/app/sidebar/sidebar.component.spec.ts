import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logoutUser', 'removeToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate to login on successful logout', () => {
    authService.logoutUser.and.returnValue(of({ message: 'Déconnexion réussie' }));

    component.onLogout();

    expect(authService.logoutUser).toHaveBeenCalled();
    expect(authService.removeToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle logout error', () => {
    const errorResponse = new Error('Erreur lors de la déconnexion');
    authService.logoutUser.and.returnValue(throwError(() => errorResponse));

    spyOn(console, 'error');

    component.onLogout();

    expect(authService.logoutUser).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la déconnexion', errorResponse);
  });
});
