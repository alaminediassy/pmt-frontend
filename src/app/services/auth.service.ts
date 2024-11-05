import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// Importer jwt-decode comme un any
import {jwtDecode} from 'jwt-decode';

interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

interface LoginUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerApiUrl = 'http://localhost:8098/api/users/register';
  private loginApiUrl = 'http://localhost:8098/api/users/login';
  private logoutApiUrl = 'http://localhost:8098/api/users/logout';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Inscription d'un utilisateur
  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post(this.registerApiUrl, user);
  }

  // Connexion de l'utilisateur
  loginUser(user: LoginUser): Observable<any> {
    return this.http.post(this.loginApiUrl, user);
  }

  // Stocker le token JWT dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Envoyer la requête de déconnexion au backend
  logoutUser(): Observable<any> {
    const token = this.getToken();  // Récupérer le token du localStorage

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(this.logoutApiUrl, {}, { headers });  // Retourner un Observable
    }

    // Retourne un Observable vide si aucun token n'est présent
    return of(null);
  }

  // Supprimer le token du localStorage après déconnexion
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Récupérer le token JWT du localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Décoder le token JWT et retourner userId et username
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
  // Vérifier si l'utilisateur est connecté (présence d'un token valide)
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Vérifier si le token est expiré
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);  // Temps actuel en secondes
      return decodedToken.exp && decodedToken.exp > currentTime;  // Vérifie l'expiration
    } catch (error) {
      console.error('Erreur lors de la vérification du token JWT:', error);
      return false;
    }
  }
}
