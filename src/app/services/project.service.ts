import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8091/api/projects';

  constructor(private http: HttpClient) {}

  /**
   * Method to create Project
   * @param project 
   * @param userId 
   * @param token 
   * @returns 
   */
  createProject(project: Project, userId: string, token: string): Observable<Project> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Project>(`${this.apiUrl}/create/${userId}`, project, { headers });
  }

  // Method to get all project
  getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  /**
   * Method Get project by userId
   * @param userId 
   * @returns 
   */
  getProjectsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
