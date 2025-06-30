import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../model/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) {}

    getBooks(): Observable<Book[]>  {
      return this.http.get<Book[]>(this.apiUrl);
    }
    
    getBook(id: number): Observable<Book> {
      return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }
  
    addBook(book : Book): Observable<Book[]>  {
      return this.http.post<Book[]>(`${this.apiUrl}`, book);
    }
  
    // Méthode pour mettre à jour un auteur existant
    updateBook(id: number, bookData: any, image: File | null): Observable<any> {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('description', bookData.description);
      formData.append('authorId', bookData.authorId);
      formData.append('authorName', bookData.authorName)
      if(image)
      {
        formData.append('image', image)
      }
      return this.http.put(`${this.apiUrl}/${id}`, formData);
    }
  
    deleteBook(id : number): Observable<void>{
      return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}
