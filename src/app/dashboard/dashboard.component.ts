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

  /**
   * Lifecycle hook called on component initialization.
   * Loads user information and subscribes to router events to manage dashboard content visibility.
   */
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

  /**
   * Toggles the visibility of the sidebar and stops event propagation.
   * @param event The click event that triggered this method
   */
  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.sidebarVisible = !this.sidebarVisible;
  }


  /**
   * Listens for clicks outside the sidebar to automatically close it.
   * @param event The global click event on the document
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const sidebar = document.getElementById('default-sidebar');

    if (this.sidebarVisible && sidebar && !sidebar.contains(clickedElement)) {
      this.sidebarVisible = false;
    }
  }

  /**
   * Opens a modal window by setting the isModalOpen flag to true.
   */
  openModal() {
    this.isModalOpen = true;
  }

  /**
   * Closes the modal window by setting the isModalOpen flag to false.
   */
  closeModal() {
    this.isModalOpen = false;
  }
}
