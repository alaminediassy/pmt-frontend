import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss']
})
export class TaskHistoryComponent implements OnInit {

  @Input() projectId!: number;
  @Input() taskId!: number;
  @Input() selectedTaskName: string = '';

  @Output() closeHistoryPanel = new EventEmitter<void>();

  taskHistory: any[] = [];
  userCache: { [key: number]: string } = {};

  constructor(private taskService: TaskService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadTaskHistory();
  }

  loadTaskHistory(): void {
    this.taskService.getTaskHistory(this.projectId, this.taskId).subscribe({
      next: (history) => {
        this.taskHistory = history;
        this.taskHistory.forEach((entry) => this.fetchUserName(entry.changedBy));
      },
      error: (error) => {
        console.error('Error fetching task history:', error);
      }
    });
  }

  fetchUserName(userId: number): void {
    if (this.userCache[userId]) return; 

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userCache[userId] = user.username;
        console.log("le d'utilisateur : ", this.userCache[userId])
      },
      error: () => {
        this.userCache[userId] = 'Utilisateur inconnu';
      }
    });
  }


  closePanel(): void {
    this.closeHistoryPanel.emit();
  }
}
