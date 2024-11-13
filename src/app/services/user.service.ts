import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiUrl = 'http://localhost:8098/api/users';

  constructor( private http: HttpClient ) { }

  /**
   * Fetches user details by user ID.
   * @param userId - The ID of the user to retrieve information for
   * @returns An Observable containing the user details
   */
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/${userId}`);
  }
  
}
