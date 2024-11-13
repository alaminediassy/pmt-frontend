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
  @Input() project: any = null; 
  @Output() close = new EventEmitter<void>();
  @Output() rolesUpdated = new EventEmitter<void>();
  modifiedRoles: { [memberId: number]: string } = {};

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}


  /**
   * Emits an event to close the role management panel.
   */
  closePanel() {
    this.close.emit();
  }


  /**
   * Updates the modifiedRoles object with the new role selected for a member.
   * @param memberId - The ID of the member whose role is being changed
   * @param event - The event containing the new role selected
   */
  updateRole(memberId: number, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value;
    this.modifiedRoles[memberId] = newRole;
  }


  /**
   * Saves the modified roles by calling the backend API to assign new roles to each modified member.
   * Displays a success or error message for each update and resets the modifiedRoles.
   */
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

    // Emit rolesUpdated event and close the role management panel
    this.rolesUpdated.emit();
    this.closePanel();
  }

}
