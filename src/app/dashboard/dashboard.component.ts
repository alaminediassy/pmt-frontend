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

  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const sidebar = document.getElementById('default-sidebar');

    if (this.sidebarVisible && sidebar && !sidebar.contains(clickedElement)) {
      this.sidebarVisible = false;
    }
  }


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
