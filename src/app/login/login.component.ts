import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.authService.loginUser(user).subscribe({
      next: (response) => {
        console.log("Login successfully", response);
        this.router.navigate(['/dashboard']).then(() => {
          console.log('Redirect to dashboard');
        });

      },
      error: (error) => {
        console.error('error during login', error);
      }
    })

  }
}
