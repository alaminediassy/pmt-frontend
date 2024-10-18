import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks: any[] = [];
  isTaskModalOpen = false;

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
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des tâches:', error);
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadTasks();
  }
}