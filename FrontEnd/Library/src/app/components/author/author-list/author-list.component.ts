import { Component, OnInit, ViewChild } from '@angular/core';
import { Author } from '../../../model/author';
import { AuthorService } from '../../../services/author/author.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NOTFOUND } from 'dns';


@Component({
  selector: 'app-list-author',
  standalone:true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];

  @ViewChild('authorForm') authorForm!: NgForm;
  
  authorIdToDelete! : number;
  selectedAuthor?: Author;

  errorMessage: string = '';
  errorTitle: string = '';

  showErrorModal: boolean = false;
  showDeleteModal : boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;

  isDarkMode = false; // Variable pour suivre le mode actif
  authorExist: any;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private authorService: AuthorService, private router: Router){}

  ngOnInit(){
    console.log("AuthorListComponent loaded!");
    this.loadAuthors(); 
  }

  //#récupération des données
  loadAuthors(): void {
  this.authorService.getAuthors().subscribe({
    next: data => {
      this.authors = data;
        console.log("Authors loaded:", this.authors);
      },
      error: err => {
        console.error("Error loading authors:", err);
      }
    });
  }

  loadAuthorImage(id: number): void{
    const imageUrl = `http://localhost:5000/api/authors/${id}/image`;
    this.imagePreview = imageUrl;
  }

  detailAuthors(id: number){
    this.authorService.getAuthor(id).subscribe({
      next: (data) => {
        this.selectedAuthor = data;
        this.loadAuthorImage(id);
        this.showDetailModal = true;
      },
      error: () => {
        this.selectedAuthor = undefined;
        this.errorTitle = 'Erreur';
        this.errorMessage = 'Auteur introuvable';
        this.showErrorModal = true;
      }
    })
  }

  //#region suppression des données
  openDeleteModal(id:number): void{
    this.authorIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal():void{
    this.authorIdToDelete = 0;
    this.showDeleteModal = false;
  }

  deleteAuthor(){
    console.log("Deleting author with id:", this.authorIdToDelete);
    this.authorService.deleteAuthor(this.authorIdToDelete).subscribe({
      next:() => {
        this.loadAuthors();
        this.showDeleteModal = false;
        
      },
      error: (error) => { console.error("Error while deleting") 
      if (
        error.message ===
        'This author cannot be deleted.'
      ) {
        this.errorMessage = error.message;
        this.openDeleteErrorModal(); // Afficher la modale d'erreur
      } else {
        this.closeDeleteModal(); // Fermer la modale en cas d'autres erreurs
      }
    },
    });
  }

  // Ouvre la modale d'erreur
  openDeleteErrorModal(): void {
    this.closeDeleteModal();
    this.errorTitle = 'Erreur';
    this.showErrorModal = true;
  }

  //#region modification des données
  editAuthor(id: number): void{
    this.authorService.getAuthor(id).subscribe({
        next:(author) =>{

          this.authorExist= {... author};
          this.showEditModal = true;
        },
        error: (error) => { console.error("Error while deleting") 
        if (
          error.message ===
          'This author cannot be deleted.'
        ) {
          this.errorMessage = error.message;
          this.openDeleteErrorModal(); // Afficher la modale d'erreur
        } else {
          this.closeDeleteModal(); // Fermer la modale en cas d'autres erreurs
        }
      }
    });
  }

  updateAuthor(): void {
    if (!this.authorExist || !this.authorExist.authorName){
      this.errorMessage="author name is required"
      this.showErrorModal = true;
      return
    }

    this.authorService.updateAuthor(this.authorExist.id, this.authorExist.authorName, this.selectedFile).subscribe({
      next: () => {
        this.loadAuthors();
        this.showEditModal = false;
      },
      error: () => {
        this.errorTitle = 'Error';
        this.errorMessage = 'Echec author updationg';
        this.showErrorModal = true;
      }
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

  toggleStyle() {
    this.isDarkMode = !this.isDarkMode; // Bascule entre les deux styles
  }

  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }
}
