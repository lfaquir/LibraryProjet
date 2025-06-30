import { BookService } from '../../../services/book/book.service';
import { Book } from '../../../model/book';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Author } from '../../../model/author';
import { AuthorService } from '../../../services/author/author.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-book-form',
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})

export class BookFormComponent implements OnInit {
  book: Book ={ id: 0, title:'', description:'', authorId:0, authorName:''};
  authors: Author[]=[];

  @ViewChild('bookForm') bookForm!: NgForm;

  constructor(private bookService: BookService, 
              private authorService: AuthorService, 
              private router:Router){}

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data},
        error: (err) => {
          console.error("Erreur lors du chargement des auteurs", err);
        }
    })
  }

  createBook(){
    this.bookService.addBook(this.book).subscribe( data => {
      if (this.bookForm.invalid) {
        alert('Please fill in all required fields.');
        return;
      }
      alert("New Book is created: ");
      this.router.navigate(['/BookList']); 
    });
  }

  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }
}
