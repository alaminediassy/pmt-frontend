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

  /**
   * Ouvre le modal d'invitation de membres pour un projet
   * @param projectId - ID du projet sélectionné pour l'invitation
   */
  openInviteMemberModal(projectId: number) {
    console.log('ID du projet sélectionné:', projectId);
    this.selectedProjectId = projectId;
    this.isInviteMemberModalOpen = true;
  }

  /**
   * Ouvre le modal de création de tâche
   */
  openTaskModal() {
    this.isTaskModalOpen = true;
  }

  /**
   * Ferme le modal de création de tâche
   */
  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  /**
   * Ferme les modals (invitation de membres et création de tâches)
   */
  closeInviteMemberModal() {
    this.isInviteMemberModalOpen = false;
    this.isTaskModalOpen = false;
    this.selectedProjectId = null;
  }

  /**
   * Ouvre le panel de gestion des rôles pour un projet spécifique
   * @param project - Projet sélectionné pour la gestion des rôles
   */
  openRoleManagementPanel(project: any) {
    console.log('Projet sélectionné pour la gestion des rôles:', project);
    this.selectedProject = project;
    this.isPanelOpen = true;
  }

  /**
   * Ferme le panel de gestion des rôles
   */
  closeRoleManagementPanel() {
    this.isPanelOpen = false;
    this.selectedProject = null;
  }

  // Rafraîchissement des rôles
  isRefreshing: boolean = false;

  /**
   * Déclenche le rafraîchissement de la liste des projets après une mise à jour des rôles
   */
  onRolesUpdated() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      console.log('Rôles mis à jour, rafraîchissement du projet...');
      this.refreshSelectedProject();
    }
  }

  /**
   * Rafraîchit les informations du projet sélectionné après modification
   */
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
