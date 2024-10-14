import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";

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
  private registerApiUrl= 'http://localhost:8091/api/users/register';
  private loginApiUrl = 'http://localhost:8091/api/users/login';
  private logoutApiUrl = 'http://localhost:8091/api/users/logout';
  private tokenKey = 'authToken'

  constructor(private http: HttpClient) {}

  // Inscription d'un utilisateur
  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post(this.registerApiUrl, user);
  }

  loginUser(user: LoginUser): Observable<any> {
    return this.http.post(this.loginApiUrl, user);
  }

  // Stocker le token JWT dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }



  // Méthode pour envoyer la requête de déconnexion au backend
  logoutUser(): Observable<any> {
    const token = this.getToken();  // Récupérer le token du localStorage

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(this.logoutApiUrl, {}, { headers });  // Retourner un Observable
    }
    
    // Retourne un Observable vide si aucun token n'est présent
    return of(null);  // Utiliser 'of' pour retourner un Observable
  }

  // Supprimer le token du localStorage après déconnexion
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Récupérer le token JWT
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  // Décoder le token JWT
  decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    // Décoder le payload du token (entre les 2 points du JWT)
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  // Récupérer les informations de l'utilisateur connecté (comme le username) à partir du token décodé
  getUserInfo(): any {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté (présence d'un token valide)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Retourne true si le token est présent
  }
}
