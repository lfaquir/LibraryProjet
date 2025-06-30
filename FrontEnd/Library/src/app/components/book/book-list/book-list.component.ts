// src/app/components/book-list/book-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Book } from '../../../model/book';
import { BookService } from '../../../services/book/book.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Author } from '../../../model/author';
import { AuthorService } from '../../../services/author/author.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {

  books: Book[] = [];
  authors: Author[]=[];

  @ViewChild('bookForm') bookForm!: NgForm;

  selectedBook?: Book;

  bookExist: any;

  bookIdToDelete! : number;
  
  errorMessage: string = '';
  errorTitle: string = '';
  
  showErrorModal: boolean = false;
  showDeleteModal : boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;

  selectedFile: File | null = null;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(private bookService: BookService, private authorService: AuthorService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
    
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        console.log('Auteurs charged:', this.authors);
      },
      error: (err) => {
        console.error('Error while charging books', err);
      }
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      console.log("this data "+ data)
    });
  }

  loadBookImage(id: number): void{
    const imageUrl = `http://localhost:5000/api/books/${id}/image`;
    this.imagePreview = imageUrl;
  }

  detailBooks(id: number){
    this.bookService.getBook(id).subscribe( {
      next: (data) => {
        this.selectedBook = data;
        this.loadBookImage(id);
        this.showDetailModal = true;
      },
      error: () => {
        this.selectedBook = undefined;
        this.errorTitle = 'Erreur';
        this.errorMessage = 'Auteur introuvable';
        this.showErrorModal = true;
      }
    })
  }

  //#region suppression des données
  openDeleteModal(id:number): void{
    this.bookIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal():void{
    this.bookIdToDelete = 0;
    this.showDeleteModal = false;
  }

  
  deleteBook(){
    this.bookService.deleteBook(this.bookIdToDelete).subscribe({
      next:() => {
        this.loadBooks();
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

  // Ouvre la modale d'erreur
  openDeleteErrorModal(): void {
    this.closeDeleteModal();
    this.errorTitle = 'Erreur';
    this.showErrorModal = true;
  }

  //#region modification des données
  editBook(id: number): void{
    this.bookService.getBook(id).subscribe({
        next:(book) =>{

          this.bookExist= {... book};
          console.log(this.bookExist);
          console.log('bookExist.authorId:', this.bookExist.authorId);
          console.log('authors:', this.authors);
          this.showEditModal = true;
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
      }
    });
  }

  updateBook(): void {
    if (!this.bookExist|| !this.bookExist.title) return;
  
    if (this.bookForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    this.bookService.updateBook(this.bookExist.id, this.bookExist, this.selectedFile).subscribe({
      next: () => {
        alert("Book updated successfully.");
        this.loadBooks();          
        this.showEditModal = false;
      },
      error: (err) => {
        console.error("Update error", err);
        this.errorMessage = "Failed to update the book.";
        this.openDeleteErrorModal();
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

  closeEditModal(): void {
    this.showEditModal = false;
  }


  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }
}
