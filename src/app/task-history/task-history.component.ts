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

  /**
   * Initialisation du composant
   * Charge l'historique des modifications de la tâche dès le chargement du composant
   */
  ngOnInit(): void {
    this.loadTaskHistory();
  }

  /**
   * Charge l'historique des modifications pour la tâche spécifiée
   * Appelle le service pour récupérer l'historique, puis charge les noms d'utilisateur associés
   */
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

  /**
   * Récupère le nom de l'utilisateur associé à un ID donné et le met en cache
   * @param userId - L'ID de l'utilisateur dont on veut récupérer le nom
   */
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

  /**
   * Émet un événement pour fermer le panneau d'historique des tâches
   */
  closePanel(): void {
    this.closeHistoryPanel.emit();
  }
}
