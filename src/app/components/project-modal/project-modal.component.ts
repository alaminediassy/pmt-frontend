import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Importer ToastrService

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

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    const project = {
      name: this.projectName,
      description: this.projectDescription,
      startDate: this.projectStartDate
    };

    const token = this.authService.getToken();
    const userInfo = this.authService.getUserInfo();

    if (!token || !userInfo || !userInfo.userId) {
      console.error('Erreur: Utilisateur non authentifié ou token manquant');
      this.toastr.error('Erreur d\'authentification', 'Erreur');
      this.router.navigate(['/login']);
      return;
    }

    const userId = userInfo.userId;

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
