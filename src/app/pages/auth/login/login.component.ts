// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email" required>
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error">
            Please enter a valid email.
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" formControlName="password" required>
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error">
            Password is required.
          </div>
        </div>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register here</a>.</p>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      width: 100%;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: red;
      font-size: 12px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          // Store the token and role in localStorage
          localStorage.setItem('authToken', response.access_token);
          localStorage.setItem('role', response.role);
          console.log('Login successful, token stored:', response.access_token); // Debug log
          alert('Login successful!');
          this.router.navigateByUrl(response.role === 'ADMIN' ? '/event' : '/reserve');
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
