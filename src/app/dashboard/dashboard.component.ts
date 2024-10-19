import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  sidebarVisible: boolean = false; 
  username: string = '';
  userId: number | null = null;
  showDashboardContent: boolean = true;

  // Open create project modal
  isModalOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username;
      this.userId = userInfo.userId;
    }

    // Gérer l'affichage du contenu principal du dashboard
    this.router.events.subscribe(() => {
      this.showDashboardContent = this.router.url === '/dashboard';
    });
  }

  // Méthode pour ouvrir/fermer le sidebar avec prevention de la propagation
  toggleSidebar(event: Event) {
    event.stopPropagation();  // Empêche la propagation du clic pour ne pas fermer immédiatement
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Ferme le sidebar si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const sidebar = document.getElementById('default-sidebar');

    // Vérifie si le clic s'est produit en dehors du sidebar et que le sidebar est visible
    if (this.sidebarVisible && sidebar && !sidebar.contains(clickedElement)) {
      this.sidebarVisible = false;
    }
  }


  // Méthode pour ouvrir le modal de création de projet
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
