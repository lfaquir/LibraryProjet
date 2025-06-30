import { Component } from '@angular/core';
import { AuthorService } from '../../../services/author/author.service';
import { Author } from '../../../model/author';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css'
})
export class AuthorFormComponent {

  author: Author = { id: 0, authorName: '' };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  

  constructor(private authorService: AuthorService, private router: Router) {}

  createAuthor() {
    this.authorService.addAuthor(this.author.authorName, this.selectedFile!).subscribe({
      next: () => {
        alert("New Author created");
        this.router.navigate(['/AuthorList']);
      },
      error: err => {
        console.error('Error creating author', err);
        alert("Error creating author!");
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

  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }
}
