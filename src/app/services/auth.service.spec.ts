import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { jwtDecode } from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('authToken');
  });

  it('should login and save token', () => {
    const mockResponse = { token: 'mockToken' };
    const loginData = { email: 'test@example.com', password: 'password123' };

    service.loginUser(loginData).subscribe(response => {
      expect(response.token).toEqual(mockResponse.token);
      service.saveToken(response.token);
      expect(localStorage.getItem('authToken')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne('http://localhost:8098/api/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return user info from decoded token', () => {
    const mockToken = 'mockToken';
    const decodedToken = { userId: 1, username: 'testUser', exp: Date.now() / 1000 + 3600 };

    // Sauvegarde le token simulé dans localStorage
    localStorage.setItem('authToken', mockToken);

    // Espionne et remplace l'implémentation de jwtDecode pour retourner un token décodé fixe
    spyOn<any>(window as any, 'jwtDecode').and.returnValue(decodedToken);

    const userInfo = service.getUserInfo();
    expect(userInfo).toEqual({ userId: 1, username: 'testUser' });
  });

  it('should return null if token is invalid', () => {
    spyOn(service as any, 'getToken').and.returnValue(null);

    const userInfo = service.getUserInfo();
    expect(userInfo).toBeNull();
  });
});
