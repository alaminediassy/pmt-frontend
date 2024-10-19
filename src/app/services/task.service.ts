import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private projectApiUrl = 'http://localhost:8091/api/projects';

  constructor(private http: HttpClient) {}

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



}
