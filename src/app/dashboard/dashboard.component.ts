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
  userId: number | null = null;  // Stocker le userId pour d'autres opérations (comme la création de projet)

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();  // Récupérer les infos utilisateur
    if (userInfo) {
      this.username = userInfo.username;  // Afficher le username
      this.userId = userInfo.userId;  // Stocker l'userId pour l'utiliser plus tard
    }
  }
}
