import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

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

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.authService.loginUser(user).subscribe({
      next: (response) => {
        const token = response.token;  // Token renvoyé par l'API
        this.authService.saveToken(token);  // Stocker le token dans le localStorage

        const decodedToken = this.authService.decodeToken(token);  // Décoder le token pour obtenir les infos utilisateur
        console.log("Decoded token:", decodedToken);  // Affiche les informations du token (incluant le username)

        // Rediriger vers le dashboard
        this.router.navigate(['/dashboard']).then(() => {
          console.log('Redirect to dashboard');
        });
      },
      error: (error) => {
        console.error('Error during login', error);
        this.errorMessage = "Email ou mot de passe incorrect";
      }
    });
  }
}
