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

  // Méthode pour créer une nouvelle tâche
  createTask(taskData: any, projectId: number, userId: number): Observable<any> {
    return this.http.post(`${this.projectApiUrl}/projects/${projectId}/tasks/${userId}`, taskData);
  }

  // Obtenir les tâches d'un projet donné
  getTasksByProject(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks`);
  }

  // Récupérer les tâches par ID utilisateur
  getTasksByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/tasks/user/${userId}`);
  }

  // Méthode pour mettre à jour le statut d'une tâche
  updateTaskStatus(taskId: number, projectId: number, userId: number, status: string): Observable<any> {
    const url = `${this.projectApiUrl}/${projectId}/tasks/${taskId}/update-status/${userId}`;
    const statusBody = { status };  // Encapsuler dans un objet si le backend attend un body JSON
    return this.http.put(url, statusBody);  // Appel PUT
  }

  // Nouvelle méthode pour récupérer les membres d'un projet
  getProjectMembers(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/members`);
  }

  // Assigner une tâche à un membre
  assignTaskToMember(projectId: number, taskId: number, assigneeId: number): Observable<any> {
    return this.http.post(`${this.projectApiUrl}/${projectId}/tasks/${taskId}/assign-task/${assigneeId}`, {});
  }

  // task.service.ts
  getTasksByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks`);
  }

  // Method to update the task
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


  // Récupérer l'historique des modifications d'une tâche
  getTaskHistory(projectId: number, taskId: number): Observable<any> {
    return this.http.get(`${this.projectApiUrl}/${projectId}/tasks/${taskId}/history`);
  }

}
