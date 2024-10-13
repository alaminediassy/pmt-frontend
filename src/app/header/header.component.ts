import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Variable pour gérer l'état du menu mobile
  mobileMenuOpen = false;

  // Navigation menu
  navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
  ];

  // Méthode pour ouvrir/fermer le menu mobile
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}