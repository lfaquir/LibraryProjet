import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../model/user';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class UserListComponent implements OnInit{

  users: User[] = [];


  @ViewChild('userForm') userForm!: NgForm;

  selectedUser?: User;

  registerForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;

  existingUserId: any;
  
  userExist: any;

  userIdToDelete! : number;
  
  errorMessage: string = '';
  errorTitle: string = '';
  
  showErrorModal: boolean = false;
  showDeleteModal : boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;

  constructor(private router: Router, private userService: UserService, private authService: AuthService ){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void{
    this.userService.getUsers().subscribe({
      next: (data) =>{
        this.users = data;
        
      },
      error: (err) => {
        console.error('Error while changing users', err)
      }
    })
  }

  loadUserImage(id: number): void{
    const imageUrl = `http://localhost:5000/api/users/${id}/image`;
    this.imagePreview = imageUrl;
  }

  //#region suppression des données
  openDeleteModal(id:number): void{
    this.userIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal():void{
    this.userIdToDelete = 0;
    this.showDeleteModal = false;
  }

  // Ouvre la modale d'erreur
  openDeleteErrorModal(): void {
    this.closeDeleteModal();
    this.errorTitle = 'Erreur';
    this.showErrorModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  detailUser(id: number){
    this.userService.getUser(id).subscribe( {
      next: (data) => {
        this.selectedUser = data;
        this.loadUserImage(id);
        this.showDetailModal = true;
      },
      error: () => {
        this.selectedUser = undefined;
        this.errorTitle = 'Erreur';
        this.errorMessage = 'User introuvable';
        this.showErrorModal = true;
      }
    })
  }

  editUser(id: number): void{
    this.userService.getUser(id).subscribe({
        next:(user) =>{

          this.userExist= {... user};
          this.showEditModal = true;
        },
        error: (error) => { console.error("Error while deleting") 
        if (
          error.message ===
          'This user cannot be deleted.'
        ) {
          this.errorMessage = error.message;
          this.openDeleteErrorModal(); // Afficher la modale d'erreur
        } else {
          this.closeDeleteModal(); // Fermer la modale en cas d'autres erreurs
        }
      }
    });
  }


updateUser(): void {
  if (!this.userExist || !this.userForm) {
    console.error("Form or user not initialized");
    return;
  }

  if (this.userForm.invalid) {
    alert('Please fill in all required fields.');
    return;
  }

  this.userService.updateUser(this.userExist.id, this.userForm.value, this.selectedFile).subscribe({
    next: () => {
      alert("User updated!");
      this.loadUsers();
      this.showEditModal = false;
    },
    error: (err) => {
      console.error("Error updating", err);
      this.errorMessage = "Update failed.";
      this.openDeleteErrorModal();
    }
  });
}



deleteUser(){
    console.log("Deleting user with id:", this.userIdToDelete);
    this.userService.deleteUser(this.userIdToDelete).subscribe({
      next:() => {
        this.loadUsers();
        this.showDeleteModal = false;
        
      },
      error: (error) => { console.error("Error while deleting") 
      if (
        error.message ===
        'This book cannot be deleted.'
      ) {
        this.errorMessage = error.message;
        this.openDeleteErrorModal(); // Afficher la modale d'erreur
      } else {
        this.closeDeleteModal(); // Fermer la modale en cas d'autres erreurs
      }
    },
    });
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
