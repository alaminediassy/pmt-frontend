import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  isInviteMemberModalOpen = false;
  selectedProjectId: number | null = null;
  projects: any[] = [];
  selectedProject: any = null;
  isPanelOpen = false; 

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  // Méthode pour ouvrir le modal d'invitation
  openInviteMemberModal(projectId: number) {
    console.log('ID du projet sélectionné:', projectId);
    this.selectedProjectId = projectId;
    this.isInviteMemberModalOpen = true;
  }

  // Méthode pour fermer le modal d'invitation
  closeInviteMemberModal() {
    this.isInviteMemberModalOpen = false;
    this.selectedProjectId = null;
  }

  // Méthode pour ouvrir le panel de gestion des rôles
  openRoleManagementPanel(project: any) {
    console.log('Projet sélectionné pour la gestion des rôles:', project);
    this.selectedProject = project;
    this.isPanelOpen = true;  // Afficher le panel de gestion des rôles
  }

  // Méthode pour fermer le panel de gestion des rôles
  closeRoleManagementPanel() {
    this.isPanelOpen = false;
    this.selectedProject = null;
  }


  isRefreshing: boolean = false;

onRolesUpdated() {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    console.log('Rôles mis à jour, rafraîchissement du projet...');
    this.refreshSelectedProject();
  }
}

refreshSelectedProject() {
  const userInfo = this.authService?.getUserInfo();
  if (userInfo && this.selectedProjectId) {
    this.projectService.getProjectsByUserId(userInfo.userId).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.selectedProject = this.projects.find(proj => proj.id === this.selectedProjectId);
        console.log("Projets mis à jour:", this.projects);  // Ajoutez un log ici pour voir la réponse
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des projets:', error);  // Vérifiez cette ligne
      }
    });
  }
}


  

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    const userInfo = this.authService?.getUserInfo();  // Vérifiez si authService et getUserInfo sont non null
  
    if (userInfo && userInfo.userId) {
      this.projectService.getProjectsByUserId(userInfo.userId).subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des projets:', error);
        }
      });
    } else {
      console.error('Utilisateur non authentifié ou informations utilisateur manquantes');
    }
  }
  
}
