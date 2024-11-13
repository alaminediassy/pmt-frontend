import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss']
})
export class InviteMemberComponent implements OnInit {
  @Input() isInviteMemberModalOpen = false; 
  @Output() close = new EventEmitter<void>(); 
  email: string = '';
  @Input() selectedProjectId: number | null = null;
  
  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}


  /**
   * Lifecycle hook triggered on component initialization.
   * Logs the selected project ID for debugging purposes.
   */
  ngOnInit(): void {
    console.log('ID du projet sélectionné:', this.selectedProjectId);
  }

  
  /**
   * Closes the invite member modal and emits the `close` event to notify the parent component.
   */
  closeInviteMemberModal() {
    this.close.emit();
  }

  /**
   * Handles the submission of the member invitation.
   * Validates input fields, retrieves user info from the AuthService, and calls ProjectService
   * to invite the specified email address to the selected project.
   */
  onSubmit() {
    if (!this.email || !this.selectedProjectId) {
      console.error('Veuillez remplir tous les champs');
      this.toastr.error('Veuillez remplir tous les champs', 'Erreur');
      return;
    }

    // Get user information from the AuthService
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.projectService.inviteMemberToProject(this.selectedProjectId, userInfo.userId, this.email).subscribe({
        next: (response: any) => {
          console.log('Membre invité avec succès', response);
          this.toastr.success('Invitation envoyée avec succès', 'Succès');
          this.closeInviteMemberModal();
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'invitation du membre:', error);
          this.toastr.error('Erreur lors de l\'invitation du membre', 'Erreur');
        }
      });
    }
  }
}
