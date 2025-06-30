import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth'

  constructor(private http:HttpClient, private route: Router, @Inject(PLATFORM_ID) private platformId: Object ) {}



login(credentials: { email: string; password: string }) {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
    .pipe(tap(res => {
      localStorage.setItem('token', res.token);
    }));
}

isLoggedIn(): boolean {
  if (isPlatformBrowser(this.platformId)) {
    return !!localStorage.getItem('token');
  }
  return false;
}

isAdmin(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    
    return decoded.role === 'admin' || (Array.isArray(decoded.role) && decoded.role.includes('admin'));
  } catch (e) {
    return false;
  }
}


getToken(): string | null {
    return localStorage.getItem('token');
  }

getUser(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token); // Cela retourne les claims du token
    }
    return null;
  }
}


