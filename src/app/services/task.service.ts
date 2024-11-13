import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private projectApiUrl = 'http://localhost:8098/api/projects';

  constructor(private http: HttpClient, private authService: AuthService) {}


  /**
   * Creates a new task within a specific project for a specific user.
   * @param taskData - The task details to be created
   * @param projectId - ID of the project where the task will be created
   * @param userId - ID of the user creating the task
   * @returns An Observable containing the server's response
   */
  createTask(taskData: any, projectId: number, userId: number): Observable<any> {
    return this.http.post(`${this.projectApiUrl}/projects/${projectId}/tasks/${userId}`, taskData);
  }

  
  /**
   * Retrieves all tasks associated with a given project.
   * @param projectId - ID of the project whose tasks are to be fetched
   * @returns An Observable with the list of tasks for the specified project
   */
  getTasksByProject(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks`);
  }

  
  /**
   * Retrieves tasks assigned to a specific user.
   * @param userId - ID of the user whose tasks are to be retrieved
   * @returns An Observable with the list of tasks assigned to the user
   */
  getTasksByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/tasks/user/${userId}`);
  }

  
  /**
   * Updates the status of a specific task within a project.
   * @param taskId - ID of the task to update
   * @param projectId - ID of the project the task belongs to
   * @param userId - ID of the user performing the update
   * @param status - New status for the task
   * @returns An Observable containing the server's response
   */
  updateTaskStatus(taskId: number, projectId: number, userId: number, status: string): Observable<any> {
    const url = `${this.projectApiUrl}/${projectId}/tasks/${taskId}/update-status/${userId}`;
    const statusBody = { status };
    return this.http.put(url, statusBody);
  }

  
  /**
   * Retrieves all members of a given project.
   * @param projectId - ID of the project whose members are to be retrieved
   * @returns An Observable with the list of project members
   */
  getProjectMembers(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/members`);
  }

  
  /**
   * Assigns a specific task to a member within a project.
   * @param projectId - ID of the project containing the task
   * @param taskId - ID of the task to assign
   * @param assigneeId - ID of the user to whom the task is assigned
   * @returns An Observable containing the server's response
   */
  assignTaskToMember(projectId: number, taskId: number, assigneeId: number): Observable<any> {
    return this.http.post(`${this.projectApiUrl}/${projectId}/tasks/${taskId}/assign-task/${assigneeId}`, {});
  }

  
  /**
   * Retrieves tasks associated with a given project by its ID.
   * This is a duplicate method of getTasksByProject; use either as needed.
   * @param projectId - ID of the project whose tasks are to be fetched
   * @returns An Observable with the list of tasks for the specified project
   */
  getTasksByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks`);
  }

  
  /**
   * Updates a specific task's details. Requires user authentication.
   * @param projectId - ID of the project containing the task
   * @param taskId - ID of the task to update
   * @param taskData - Updated task details
   * @returns An Observable containing the server's response or an error if authentication fails
   */
  updateTask(projectId: number, taskId: number, taskData: any): Observable<any> {
    const userInfo = this.authService.getUserInfo();

    if (!userInfo || !userInfo.userId) {
      return throwError('User not authenticated or no userId available');
    }

    return this.http.put(`${this.projectApiUrl}/${projectId}/tasks/${taskId}/update/${userInfo.userId}`, taskData)
      .pipe(
        catchError(error => {
          console.error('Error updating task:', error);
          return throwError(error);
        })
      );
  }


  
  /**
   * Retrieves the history of changes for a specific task within a project.
   * @param projectId - ID of the project containing the task
   * @param taskId - ID of the task whose history is to be fetched
   * @returns An Observable containing the history of changes for the specified task
   */
  getTaskHistory(projectId: number, taskId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks/${taskId}/history`);
  }

}
