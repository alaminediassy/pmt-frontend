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
  isTaskModalOpen = false;
  projects: any[] = [];
  selectedProject: any = null;
  isPanelOpen = false;

  // Breadcrump :
  breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Projects' }
  ];

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  // Méthode pour ouvrir le modal d'invitation
  openInviteMemberModal(projectId: number) {
    console.log('ID du projet sélectionné:', projectId);
    this.selectedProjectId = projectId;
    this.isInviteMemberModalOpen = true;
  }

  // Ouvrir le modal de création de tâche
  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  // Fermer les modals (invitation de membres et création de tâches)
  closeInviteMemberModal() {
    this.isInviteMemberModalOpen = false;
    this.isTaskModalOpen = false;
    this.selectedProjectId = null;
  }

  // Ouvrir le panel de gestion des rôles
  openRoleManagementPanel(project: any) {
    console.log('Projet sélectionné pour la gestion des rôles:', project);
    this.selectedProject = project;
    this.isPanelOpen = true;
  }

  // Fermer le panel de gestion des rôles
  closeRoleManagementPanel() {
    this.isPanelOpen = false;
    this.selectedProject = null;
  }

  // Rafraîchissement des rôles
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
          console.log("Projets mis à jour:", this.projects);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des projets:', error);
        }
      });
    }
  }

  // Modal pour création de projets
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    const userInfo = this.authService?.getUserInfo();
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
