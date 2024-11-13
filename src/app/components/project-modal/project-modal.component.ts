import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss']
})
export class ProjectModalComponent {
  @Input() isModalOpen = false;
  @Output() close = new EventEmitter<void>();

  projectName: string = '';
  projectDescription: string = '';
  projectStartDate: string = '';

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Emits the close event to notify the parent component to close the modal.
   */
  closeModal() {
    this.close.emit();
  }


  /**
   * Handles the form submission to create a new project.
   * Validates user authentication, prepares project data, and calls the ProjectService.
   * On success, closes the modal and redirects to the dashboard; on failure, displays an error message.
   */
  onSubmit() {
    const project = {
      name: this.projectName,
      description: this.projectDescription,
      startDate: this.projectStartDate
    };

    // Retrieve authentication token and user information
    const token = this.authService.getToken();
    const userInfo = this.authService.getUserInfo();

    // Check for valid user authentication
    if (!token || !userInfo || !userInfo.userId) {
      console.error('Erreur: Utilisateur non authentifié ou token manquant');
      this.toastr.error('Erreur d\'authentification', 'Erreur');
      this.router.navigate(['/login']);
      return;
    }

    const userId = userInfo.userId;

    // Call ProjectService to create the project and handle responses
    this.projectService.createProject(project, userId.toString(), token).subscribe({
      next: (response) => {
        console.log('Projet créé avec succès', response);
        this.toastr.success('Projet créé avec succès', 'Succès');
        this.closeModal();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du projet', error);
        this.toastr.error('Erreur lors de la création du projet', 'Erreur');
      }
    });
  }
}
