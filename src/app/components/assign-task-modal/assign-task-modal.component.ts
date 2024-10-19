import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-assign-task-modal',
  templateUrl: './assign-task-modal.component.html',
  styleUrls: ['./assign-task-modal.component.scss']
})
export class AssignTaskModalComponent implements OnInit {
  
  @Input() isModalOpen: boolean = false;
  @Input() selectedTaskId: number | null = null;
  @Input() selectedProjectId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskAssigned = new EventEmitter<void>();

  members: any[] = [];
  selectedMemberId: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.selectedProjectId) {
      this.loadProjectMembers(this.selectedProjectId);
    }
  }

  // Charger les membres du projet sélectionné
  loadProjectMembers(projectId: number) {
    this.projectService.getProjectMembers(projectId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des membres du projet :', error);
      }
    });
  }

  // Assigner la tâche au membre sélectionné
  assignTask() {
    if (this.selectedTaskId && this.selectedMemberId) {
      this.projectService.assignTaskToMember(this.selectedProjectId!, this.selectedTaskId, this.selectedMemberId).subscribe({
        next: () => {
          this.taskAssigned.emit();  // Notifier la tâche assignée
          this.closeModal.emit();    // Fermer le modal
        },
        error: (error) => {
          console.error('Erreur lors de l\'assignation de la tâche :', error);
        }
      });
    }
  }

  close() {
    this.closeModal.emit();
  }
}
