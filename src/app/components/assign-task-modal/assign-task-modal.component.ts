import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-assign-task-modal',
  templateUrl: './assign-task-modal.component.html',
  styleUrls: ['./assign-task-modal.component.scss']
})
export class AssignTaskModalComponent implements OnChanges {

  @Input() isModalOpen: boolean = false;
  @Input() selectedTask: any = null; 
  @Input() selectedProject: any = null; 
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskAssigned = new EventEmitter<void>();

  members: any[] = [];
  selectedMemberId: number | null = null;

  constructor(private projectService: ProjectService, private authService: AuthService) {}


  /**
   * Detects changes to input properties. Loads members if a new project is selected.
   * @param changes - Contains the changed input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject'] && this.selectedProject) {
      console.log('Projet sélectionné a changé :', this.selectedProject);
      this.loadProjectMembers(this.selectedProject.id);
    }
  }

  /**
   * Loads members of the given project.
   * @param projectId - ID of the project whose members are to be loaded
   */
  loadProjectMembers(projectId: number) {
    console.log('Chargement des membres pour le projet ID:', projectId);
    this.projectService.getProjectMembers(projectId).subscribe({
      next: (members) => {
        this.members = members;
        console.log('Membres récupérés :', this.members);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres :', error);
      }
    });
  }


  /**
   * Assigns the selected task to a member. Emits events upon success or error.
   */
  assignTask() {
    if (this.selectedTask && this.selectedMemberId) {
      const userInfo = this.authService.getUserInfo();
      const userId = userInfo ? userInfo.userId : null;
  
      if (!userId) {
        console.error("Utilisateur non authentifié");
        return;
      }
  
      this.projectService.assignTaskToMember(
        this.selectedProject.id,
        this.selectedTask.id,
        this.selectedMemberId,
        userId 
      ).subscribe({
        next: () => {
          this.taskAssigned.emit(); 
          this.closeModal.emit();
        },
        error: (error) => {
          console.error('Erreur lors de l\'assignation de la tâche :', error);
        }
      });
    }
  }
  
  /**
   * Closes the modal by emitting the closeModal event.
   */
  close() {
    this.closeModal.emit();
  }
}
