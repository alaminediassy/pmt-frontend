import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  /**
   * Méthode pour gérer la soumission du formulaire d'inscription
   * Crée un nouvel utilisateur en appelant le service d'authentification
   */
  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successfully', response);
        this.router.navigate(['/login']).then(() => {
          console.log('Redirect to login');
        });
      },
      error: (error) => {
        console.error('Error during registration', error);
        this.errorMessage = "Erreur lors de l'inscription, veuillez réessayer.";
      },
      complete: () => {
        console.log('Registration process completed');
      }
    });
  }
}
