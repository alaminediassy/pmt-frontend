import { Component } from '@angular/core';
import { AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

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
          console.log('Redirect to dashboard');
        });
      },
      error: (error) => {
        console.error('error during registration', error);
      },
      complete: () => {
        console.log('Registration successfully');
      }
    });

  }
}
