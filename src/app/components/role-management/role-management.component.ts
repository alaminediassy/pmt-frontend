import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent {
  @Input() project: any = null;  // Projet sélectionné pour la gestion des rôles
  @Output() close = new EventEmitter<void>();  // Événement pour fermer le panel
  @Output() rolesUpdated = new EventEmitter<void>();  // Événement pour notifier que les rôles ont été modifiés
  modifiedRoles: { [memberId: number]: string } = {};  // Stockage des changements de rôles

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  // Fermer le panel
  closePanel() {
    this.close.emit();
  }

  // Méthode pour modifier un rôle avec typage correct
  updateRole(memberId: number, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value;
    this.modifiedRoles[memberId] = newRole;
  }

  // Méthode sauvegarde des changements
  saveChanges() {
    if (this.project && Object.keys(this.modifiedRoles).length > 0) {
        Object.entries(this.modifiedRoles).forEach(([memberId, newRole]) => {
            this.projectService.assignRoleToMember(this.project.id, +memberId, newRole).subscribe({
                next: (response) => {
                    console.log('Réponse du backend:', response);
                    this.toastr.success(response?.message || `Rôle mis à jour pour le membre ${memberId}`);
                },
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        console.error('Erreur lors de la mise à jour du rôle:', error.message);
                        this.toastr.error(error.error?.message || 'Erreur lors de la mise à jour du rôle');
                    } else {
                        console.error('Erreur inconnue lors de la mise à jour du rôle:', error);
                        this.toastr.error('Erreur inconnue lors de la mise à jour');
                    }
                }
            });
        });
    }

    this.rolesUpdated.emit();  // Notifier le parent que les rôles ont été modifiés
    this.closePanel();  // Fermer le panel après l'enregistrement
  }

}
