import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUser(id: number): Observable<User> {
          return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get(`${this.apiUrl}/me`, { headers: headers });
  }

  addUser(userName: string, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('userName', userName);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post(`${this.apiUrl}`, formData);
  }


  updateUser(id: number, userData: any, image: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('Username', userData.userName);
    formData.append('Email', userData.userEmail);
    formData.append('Password', userData.password);
    formData.append('Role', userData.role);

    if (image) {
      formData.append('Image', image);
    }
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteUser(id : number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  register(userData : FormData): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/registre`, userData, { responseType: 'text' });
  }
}
