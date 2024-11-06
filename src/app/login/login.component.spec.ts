import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['loginUser', 'saveToken', 'getUserInfo']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully and redirect to dashboard', () => {
    const mockResponse = { token: 'mockToken' };
    authService.loginUser.and.returnValue(of(mockResponse));
    authService.getUserInfo.and.returnValue({ userId: 1, username: 'testUser' });

    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSubmit();

    expect(authService.loginUser).toHaveBeenCalledWith({ email: component.email, password: component.password });
    expect(authService.saveToken).toHaveBeenCalledWith(mockResponse.token);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message on failed login', () => {
    authService.loginUser.and.returnValue(throwError(() => new Error('Login failed')));

    component.email = 'wrong@example.com';
    component.password = 'wrongPassword';
    component.onSubmit();

    expect(authService.loginUser).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Email ou mot de passe incorrect');
  });
});
