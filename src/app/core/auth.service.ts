// src/app/core/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/v1/auth';
  private http = inject(HttpClient);
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  role$: Observable<string | null> = this.roleSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<{ access_token: string; role: string }> {
    return this.http
      .post<{ access_token: string; role: string }>(`${this.baseUrl}/authenticate`, credentials)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          localStorage.setItem('authToken', response.access_token); // Changed from accessToken to access_token
          localStorage.setItem('role', response.role);
          this.isLoggedInSubject.next(true);
          this.roleSubject.next(response.role);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.message || 'Login failed'));
        })
      );
  }

  register(data: { nom: string; email: string; password: string }): Observable<{ access_token: string; role: string }> {
    return this.http
      .post<{ access_token: string; role: string }>(`${this.baseUrl}/register`, data)
      .pipe(
        tap((response) => {
          console.log('Register response:', response);
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('role', response.role);
          this.isLoggedInSubject.next(true);
          this.roleSubject.next(response.role);
        }),
        catchError((error) => {
          console.error('Register error:', error);
          return throwError(() => new Error(error.message || 'Registration failed'));
        })
      );
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No authToken found in localStorage');
    }
    return token;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  isClient(): boolean {
    const role = this.getRole();
    return role === 'CLIENT';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
  }
}
