import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[ReactiveFormsModule, NgIf]
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  alert: { type: string; message: string } | null = null;
  fieldErrors: { [key: string]: string } = {};


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/Home']);
        this.errorMessage = null;
      },
      error: (error: HttpErrorResponse) => {
        this.fieldErrors = {};

        // Cas 401 simple
        if (error.status === 401) {
          this.errorMessage = 'Email or password is incorrect.';
          return;
        }

        // Erreurs détaillées venant du backend
        if (error.error?.errors) {
          error.error.errors.forEach((err: any) => {
            switch (err.code) {
              case 'InvalidEmail':
                this.errorMessage = 'Email is incorrect.';
                break;
              case 'InvalidPassword':
                this.errorMessage = 'Password is incorrect.';
                break;
              default:
                this.errorMessage = 'An unknown error occurred.';
            }
          });
        } else {
          // Erreur générique (timeout, serveur down, etc.)
          this.errorMessage = 'Unknown error. Please try again.';
        }
      }
    });
  }
}
  // Fonction pour afficher une alerte
  showAlert(type: string, message: string): void {
    console.log('Alert:', { type, message }); // Déboguez ici pour vérifier l'appel
    this.alert = { type, message };
    setTimeout(() => (this.alert = null), 5000); // Réinitialisation après 5 secondes
  }

  navigateTo(page: string){
    this.router.navigate([`/${page}`])
  }
}
