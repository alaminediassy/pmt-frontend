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
  @Input() isInviteMemberModalOpen = false; // Contrôle l'ouverture du modal
  @Output() close = new EventEmitter<void>(); // Emission d'un événement pour la fermeture
  email: string = ''; // Stockage de l'email à inviter
  @Input() selectedProjectId: number | null = null; // Projet sélectionné
  
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
    this.close.emit(); // Émet l'événement de fermeture
  }

  // Soumettre l'invitation
  onSubmit() {
    if (!this.email || !this.selectedProjectId) {
      console.error('Veuillez remplir tous les champs');
      this.toastr.error('Veuillez remplir tous les champs', 'Erreur');
      return;
    }

    const userInfo = this.authService.getUserInfo();  // Récupérer les informations utilisateur
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
