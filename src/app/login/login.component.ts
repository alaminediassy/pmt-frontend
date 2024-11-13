import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  /**
   * Méthode appelée lors de la soumission du formulaire de connexion.
   * Prépare les informations d'utilisateur et tente la connexion via AuthService.
   */
  onSubmit() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.authService.loginUser(user).subscribe({
      next: (response) => {
        console.log("Login successfully", response);

        this.authService.saveToken(response.token);

        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          console.log('Utilisateur connecté:', userInfo.username);
        }

        this.router.navigate(['/dashboard']).then(() => {
          console.log('Redirect to dashboard');
        });
      },
      error: (error) => {
        console.error('Erreur lors de la connexion', error);
        this.errorMessage = "Email ou mot de passe incorrect";
      }
    });
  }
}
