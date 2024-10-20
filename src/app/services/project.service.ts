import { Injectable } from '@angular/core';
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
  createProject(project: any, userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/create/${userId}`, project, { headers });
  }

  // Method to get all projects
  getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  /**
   * Method Get projects by userId
   * @param userId 
   * @returns 
   */
  getProjectsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Invite a member to a project
   * @param projectId 
   * @param userId 
   * @param email 
   * @returns 
   */
  inviteMemberToProject(projectId: number, userId: number, email: string): Observable<any> {
    const inviteRequestDTO = { email };  // Construire l'objet à envoyer
    const url = `${this.apiUrl}/${projectId}/invite/${userId}`;
    return this.http.post<any>(url, inviteRequestDTO);  // Retourne un Observable avec la réponse du serveur
  }

  /**
   * Method to assign role to member
   * @param projectId 
   * @param memberId 
   * @param role 
   * @returns 
   */
  assignRoleToMember(projectId: number, memberId: number, role: string): Observable<any> {
    const roleAssignmentDTO = { role };
    return this.http.put(`${this.apiUrl}/${projectId}/assign-role/${memberId}`, roleAssignmentDTO);
  }


  /**
   * Method to create project
   * @param taskData 
   * @param userId 
   * @returns 
   */
  createTask(taskData: any, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${taskData.projectId}/tasks/${userId}`;
    return this.http.post(url, taskData);
  }
}
