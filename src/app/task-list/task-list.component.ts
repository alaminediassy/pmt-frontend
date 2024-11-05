import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasks: any[] = [];
  isTaskModalOpen = false;
  isAssignTaskModalOpen = false;
  isEditTaskModalOpen = false;

  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksCompleted: any[] = [];

  selectedTaskId: number | null = null;
  selectedProjectId: number | null = null;

  selectedTask: any = null;
  selectedProject: any = null;

  selectedTaskName: string = '';
  isHistoryPanelOpen: boolean = false;

  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Tasks' }
  ];

  constructor(
    private taskService: TaskService, 
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  // Ouvrir le modal d'assignation avec la tâche et le projet sélectionnés
  openAssignTaskModal(task: any) {
    this.selectedTask = task;
    this.selectedTaskId = task.id;
    this.selectedProjectId = task.project.id;
    this.selectedProject = task.project;

    this.isAssignTaskModalOpen = true;
  }

  closeAssignTaskModal() {
    this.isAssignTaskModalOpen = false;
  }

  onTaskAssigned() {
    this.loadTasks(); // Recharger les tâches après l'assignation
    this.closeAssignTaskModal(); // Fermer le modal après l'assignation
  }

  // Méthode pour ouvrir le modal de modification d'une tâche
  openEditTaskModal(task: any) {
    this.selectedTask = task;
    this.selectedTaskId = task.id;
    this.selectedProjectId = task.project.id;
    this.selectedProject = task.project;

    this.isEditTaskModalOpen = true;
  }

  closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
  }

  onTaskUpdated() {
    this.loadTasks(); // Recharger les tâches après la modification
    this.closeEditTaskModal(); // Fermer le modal après modification
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
          console.log('Tâches récupérées :', this.tasks); 
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

  // Ouvrir le panneau d'historique des modifications
  openTaskHistoryPanel(task: any): void {
    this.selectedProjectId = task.project.id;
    this.selectedTaskId = task.id;
    this.selectedTaskName = task.name;
    this.isHistoryPanelOpen = true;
  }

  // Fermer le panneau d'historique
  closeTaskHistoryPanel(): void {
    this.isHistoryPanelOpen = false;
  }


  translatePriority(priority: string): string {
    const priorityMapping: { [key: string]: string } = {
      'High': 'Haute',
      'Medium': 'Moyenne',
      'Low': 'Basse'
    };
    return priorityMapping[priority] || priority;
  }

  ngOnInit(): void {
    this.loadTasks();
  }
}
