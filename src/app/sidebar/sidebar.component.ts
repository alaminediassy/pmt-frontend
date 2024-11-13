import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sidebarVisible: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Gère la déconnexion de l'utilisateur
   * Supprime le token d'authentification et redirige vers la page de connexion
   */
  onLogout() {
    this.authService.logoutUser().subscribe({
      next: (response) => {
        console.log('Déconnexion réussie', response);
        this.authService.removeToken();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion', error);
      }
    });
  }  
}
