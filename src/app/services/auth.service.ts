import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

/**
 * Interface representing the structure of a user during registration.
 */
interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

/**
 * Interface representing the structure of a user during login.
 */
interface LoginUser {
  email: string;
  password: string;
}

/**
 * AuthService provides methods for user registration, login, logout, 
 * token management, and checking user authentication status.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerApiUrl = 'http://localhost:8098/api/users/register';
  private loginApiUrl = 'http://localhost:8098/api/users/login';
  private logoutApiUrl = 'http://localhost:8098/api/users/logout';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  /**
   * Registers a new user by sending their information to the backend.
   * @param user The registration details of the user
   * @returns An observable of the server response
   */
  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post(this.registerApiUrl, user);
  }

  /**
   * Logs in a user by sending their credentials to the backend.
   * @param user The login credentials of the user
   * @returns An observable of the server response
   */
  loginUser(user: LoginUser): Observable<any> {
    return this.http.post(this.loginApiUrl, user);
  }

  /**
   * Saves the JWT token in localStorage.
   * @param token The JWT token received from the server
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  
  /**
   * Logs out the user by sending a request to the backend.
   * Includes the JWT token in the Authorization header if available.
   * @returns An observable of the server response, or a null observable if no token is found
   */
  logoutUser(): Observable<any> {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(this.logoutApiUrl, {}, { headers });  // Retourner un Observable
    }

    return of(null);
  }

  
  /**
   * Removes the JWT token from localStorage, effectively logging out the user on the client side.
   */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  
  /**
   * Retrieves the JWT token from localStorage.
   * @returns The JWT token if it exists, or null otherwise
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  /**
   * Decodes the JWT token to extract user information (userId and username).
   * @returns An object containing userId and username if the token is valid, 
   * or null if the token is missing or invalid
   */
  getUserInfo(): { userId: number, username: string } | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        return {
          userId: decodedToken.userId,
          username: decodedToken.username
        };
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT:', error);
        return null;
      }
    }
    return null;
  }


  /**
   * Checks if the user is authenticated by validating the presence and expiration of the token.
   * @returns true if the token exists and is not expired, false otherwise
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp && decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Erreur lors de la vérification du token JWT:', error);
      return false;
    }
  }
}
