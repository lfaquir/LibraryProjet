import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from '../../model/author';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private apiUrl = 'http://localhost:5000/api/authors';
  

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]>  {
      return this.http.get<Author[]>(this.apiUrl);
    }
  
  getAuthor(id: number): Observable<Author> {
      return this.http.get<Author>(`${this.apiUrl}/${id}`);
    }

  addAuthor(authorName: string, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('authorName', authorName);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post(`${this.apiUrl}`, formData);
  }

  // Méthode pour mettre à jour un auteur existant
  updateAuthor(id: number, authorName: string, image: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('authorName', authorName);

    if (image) {
      formData.append('Image', image);
    }
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteAuthor(id : number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
  
}
