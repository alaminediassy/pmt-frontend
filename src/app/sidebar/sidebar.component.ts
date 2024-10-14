import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour gérer la déconnexion
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
