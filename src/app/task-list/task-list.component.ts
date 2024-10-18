import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks: any[] = [];
  isTaskModalOpen = false;

  // Tâches filtrées par statut
  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksCompleted: any[] = [];

  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Tasks' }
  ];

  constructor(private taskService: TaskService, private authService: AuthService) {}

  // Ouvrir le modal de création de tâche
  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  // Charger les tâches de l'utilisateur
  loadTasks() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.taskService.getTasksByUserId(userInfo.userId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filterTasksByStatus();
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des tâches:', error);
        }
      });
    }
  }

  // Méthode pour filtrer les tâches selon leur statut
  filterTasksByStatus() {
    this.tasksTodo = this.tasks.filter(task => task.status === 'TODO');
    this.tasksInProgress = this.tasks.filter(task => task.status === 'IN_PROGRESS');
    this.tasksCompleted = this.tasks.filter(task => task.status === 'COMPLETED');
  }

  // Méthode appelée lorsque l'on déplace une tâche
  onTaskDrop(event: DndDropEvent, newStatus: string) {
    const task = event.data; // La tâche déplacée
    const userInfo = this.authService.getUserInfo();

    if (task && userInfo && userInfo.userId) {
      // Mise à jour du statut de la tâche côté backend
      this.taskService.updateTaskStatus(task.id, task.project.id, userInfo.userId, newStatus).subscribe({
        next: () => {
          // Recharger les tâches après le changement de statut
          this.loadTasks();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
        }
      });
    }
  }  
  

  ngOnInit(): void {
    this.loadTasks();
  }
}