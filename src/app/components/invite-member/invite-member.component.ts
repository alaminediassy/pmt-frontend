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

  ngOnInit(): void {
    console.log('ID du projet sélectionné:', this.selectedProjectId);
  }

  // Fermer la modale proprement
  closeInviteMemberModal() {
    this.close.emit();
  }

  // Soumettre l'invitation
  onSubmit() {
    if (!this.email || !this.selectedProjectId) {
      console.error('Veuillez remplir tous les champs');
      this.toastr.error('Veuillez remplir tous les champs', 'Erreur');
      return;
    }

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
