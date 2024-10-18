import { Component } from '@angular/core';
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
  
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username;
      this.userId = userInfo.userId;
    }

    this.router.events.subscribe(() => {
      this.showDashboardContent = this.router.url === '/dashboard';
    });
  }
}
