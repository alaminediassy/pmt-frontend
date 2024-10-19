import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  
  tasks: any[] = [];
  isTaskModalOpen = false;
  isAssignTaskModalOpen = false;

  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksCompleted: any[] = [];

  selectedTaskId: number | null = null;
  selectedProjectId: number | null = null;

  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Tasks' }
  ];

  constructor(private taskService: TaskService, private authService: AuthService) {}

  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  // Ouvrir le modal d'assignation avec la tâche et le projet sélectionnés
  openAssignTaskModal(taskId: number, projectId: number) {
    this.selectedTaskId = taskId;
    this.selectedProjectId = projectId;
    this.isAssignTaskModalOpen = true;
  }

  closeAssignTaskModal() {
    this.isAssignTaskModalOpen = false;
  }

  onTaskAssigned() {
    this.loadTasks(); // Recharger les tâches après l'assignation
    this.closeAssignTaskModal(); // Fermer le modal après l'assignation
  }

  // Nouvelle méthode pour gérer la création de tâche
  onTaskCreated() {
    this.loadTasks();  // Recharger les tâches après la création d'une tâche
  }

  loadTasks() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.taskService.getTasksByUserId(userInfo.userId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filterTasksByStatus(); 
        },
        error: (error) => {
          console.error('Error while fetching tasks:', error);
        }
      });
    }
  }

  filterTasksByStatus() {
    this.tasksTodo = this.tasks.filter(task => task.status === 'TODO');
    this.tasksInProgress = this.tasks.filter(task => task.status === 'IN_PROGRESS');
    this.tasksCompleted = this.tasks.filter(task => task.status === 'COMPLETED');
  }

  onTaskDrop(event: DndDropEvent, newStatus: string) {
    const task = event.data;
    const userInfo = this.authService.getUserInfo();

    if (task && userInfo && userInfo.userId) {
      this.taskService.updateTaskStatus(task.id, task.project.id, userInfo.userId, newStatus).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error while updating task status:', error);
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadTasks();
  }
}
