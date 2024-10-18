import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  // Gérer le changement de statut lorsqu'une tâche est déplacée
  onTaskDrop(event: CdkDragDrop<any[]>, newStatus: string) {
    const task = event.item.data;  // La tâche qui est déplacée
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;
  
    // Si la tâche a été déplacée dans une autre colonne
    if (previousContainer !== currentContainer) {
      const userInfo = this.authService.getUserInfo();
      
      if (task && userInfo && userInfo.userId) {
        // Appeler le backend pour mettre à jour le statut
        this.taskService.updateTaskStatus(task.id, task.project.id, userInfo.userId, newStatus).subscribe({
          next: (updatedTask) => {
            // Actualiser la liste des tâches
            this.loadTasks();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
          }
        });
      }
    }
  }  
  

  ngOnInit(): void {
    this.loadTasks();
  }
}