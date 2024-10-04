import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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

  constructor(private http: HttpClient) { }

  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post(this.registerApiUrl, user);
  }

  loginUser(user: LoginUser): Observable<any> {
    return this.http.post(this.loginApiUrl, user);
  }
}
