import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  sidebarVisible: boolean = false;
  username: string = '';
  userId: number | null = null;
  
  // Open create project modal
  isModalOpen = false;
  
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username;
      this.userId = userInfo.userId;
    }
  }
}
