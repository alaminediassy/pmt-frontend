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
  
  /**
   * List of tasks fetched from the backend
   */
  tasks: any[] = [];
  
  /**
   * Indicates whether the task creation modal is open
   */
  isTaskModalOpen = false;

  /**
   * Filtered tasks categorized by their status
   */
  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksCompleted: any[] = [];

  /**
   * Breadcrumb navigation data
   */
  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Tasks' }
  ];

  /**
   * Constructor injecting TaskService and AuthService
   * @param taskService Service for handling task operations
   * @param authService Service for managing user authentication
   */
  constructor(private taskService: TaskService, private authService: AuthService) {}

  /**
   * Opens the task creation modal
   */
  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  /**
   * Closes the task creation modal
   */
  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  /**
   * Loads tasks associated with the authenticated user by calling the TaskService
   */
  loadTasks() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.taskService.getTasksByUserId(userInfo.userId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          // Filter tasks into categories based on status
          this.filterTasksByStatus(); 
        },
        error: (error) => {
          console.error('Error while fetching tasks:', error);
        }
      });
    }
  }

  /**
   * Filters tasks into their respective status categories (TODO, IN_PROGRESS, COMPLETED)
   */
  filterTasksByStatus() {
    this.tasksTodo = this.tasks.filter(task => task.status === 'TODO');
    this.tasksInProgress = this.tasks.filter(task => task.status === 'IN_PROGRESS');
    this.tasksCompleted = this.tasks.filter(task => task.status === 'COMPLETED');
  }

  /**
   * Handles the drag-and-drop event to update the task's status
   * @param event The drop event containing the task data
   * @param newStatus The new status to assign to the task after it is moved
   */
  onTaskDrop(event: DndDropEvent, newStatus: string) {
    const task = event.data;  // The task being moved
    const userInfo = this.authService.getUserInfo();

    if (task && userInfo && userInfo.userId) {
      // Update the task status in the backend
      this.taskService.updateTaskStatus(task.id, task.project.id, userInfo.userId, newStatus).subscribe({
        next: () => {
          this.loadTasks();  // Reload tasks to reflect the new status
        },
        error: (error) => {
          console.error('Error while updating task status:', error);
        }
      });
    }
  }


  // Mettre à jour la liste des tâches après création
  onTaskCreated() {
    this.loadTasks();
  }

  /**
   * Lifecycle hook called on component initialization to load tasks
   */
  ngOnInit(): void {
    this.loadTasks();
  }
}
