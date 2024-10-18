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

  // Autres méthodes liées aux tâches peuvent être ajoutées ici
}
