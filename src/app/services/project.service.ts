import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8098/api/projects';

  constructor(private http: HttpClient) {}

  /**
   * Creates a new project associated with a specific user.
   * @param project - The project data to create
   * @param userId - ID of the user creating the project
   * @param token - JWT token for authorization
   * @returns An Observable with the server's response
   */
  createProject(project: any, userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/create/${userId}`, project, { headers });
  }

  
  /**
   * Retrieves a list of all projects.
   * @returns An Observable with the list of all projects
   */
  getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  /**
   * Retrieves projects associated with a specific user.
   * @param userId - ID of the user whose projects are being fetched
   * @returns An Observable with the user's projects
   */
  getProjectsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  
  /**
   * Sends an invitation to a user to join a specific project.
   * @param projectId - ID of the project to invite the user to
   * @param userId - ID of the user sending the invitation
   * @param email - Email of the user to be invited
   * @returns An Observable with the server's response
   */
  inviteMemberToProject(projectId: number, userId: number, email: string): Observable<any> {
    const inviteRequestDTO = { email };  // Construire l'objet à envoyer
    const url = `${this.apiUrl}/${projectId}/invite/${userId}`;
    return this.http.post<any>(url, inviteRequestDTO);  // Retourne un Observable avec la réponse du serveur
  }

  /**
   * Assigns a role to a specific project member.
   * @param projectId - ID of the project
   * @param memberId - ID of the member to assign the role to
   * @param role - Role to assign (e.g., 'admin', 'member')
   * @returns An Observable with the server's response
   */
  assignRoleToMember(projectId: number, memberId: number, role: string): Observable<any> {
    const roleAssignmentDTO = { role };
    return this.http.put(`${this.apiUrl}/${projectId}/assign-role/${memberId}`, roleAssignmentDTO);
  }


  /**
   * Creates a new task within a specified project.
   * @param taskData - The task details, including projectId
   * @param userId - ID of the user creating the task
   * @returns An Observable with the server's response
   */
  createTask(taskData: any, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${taskData.projectId}/tasks/${userId}`;
    return this.http.post(url, taskData);
  }


  /**
   * Retrieves all members of a specified project.
   * @param projectId - ID of the project whose members are being fetched
   * @returns An Observable with the list of project members
   */
  getProjectMembers(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}/members`);
  }


  /**
   * Assigns a task to a specified member within a project.
   * @param projectId - ID of the project
   * @param taskId - ID of the task to be assigned
   * @param assigneeId - ID of the member to assign the task to
   * @param userId - ID of the user performing the assignment
   * @returns An Observable with the server's response
   */
  assignTaskToMember(projectId: number, taskId: number, assigneeId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${projectId}/tasks/${taskId}/assign-task/${userId}/${assigneeId}`;
    return this.http.post(url, {});
  }
  

  /**
   * Retrieves all tasks associated with a specified project.
   * @param projectId - ID of the project whose tasks are being fetched
   * @returns An Observable with the list of tasks for the specified project
   */
  getTasksByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${projectId}/tasks`);
  }

}
