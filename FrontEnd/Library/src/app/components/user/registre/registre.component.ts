import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { UserListComponent } from '../userList/user-list/user-list.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-registre',
  standalone: true,
  templateUrl: './registre.component.html',
  imports:[ReactiveFormsModule, CommonModule, FormsModule, NgIf]

})
export class RegistreComponent {
  registerForm: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirm_password, ...userData } = this.registerForm.value;
      if (userData.password !== confirm_password) {
        alert("Passwords do not match.");
        return;
      }
      const formData = new FormData();
      formData.append('username',userData.username);
      formData.append('email',userData.email);
      formData.append('password',userData.password);
      formData.append('role',userData.role);

      if(this.selectedFile)
      {
        formData.append('image', this.selectedFile, this.selectedFile.name)
      }
      this.userService.register(formData).subscribe({
        next: () => alert("Registration successful"),
        error: (err) => {
          console.error('Erreur lors de l\'inscription', err);
          alert('Erreur : ' + (err.message || 'Une erreur est survenue'));
        }
      });
    }
  }

  //Méthode pour capturer le fichier
  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files[0]) {
        this.selectedFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
      
      reader.readAsDataURL(this.selectedFile);
    }
  }

  navigateTo(page:string): void{
    this.router.navigate([`/${page}`])
  }
}
