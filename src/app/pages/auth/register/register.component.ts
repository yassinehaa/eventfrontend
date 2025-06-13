// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="nom">Name:</label>
          <input id="nom" type="text" formControlName="nom" required>
          <div *ngIf="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched" class="error">
            Name is required.
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email" required>
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error">
            Please enter a valid email.
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" formControlName="password" required>
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error">
            Password must be at least 6 characters.
          </div>
        </div>
        <button type="submit" [disabled]="registerForm.invalid">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login here</a>.</p>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styles: [`
    .register-container {
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
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { nom, email, password } = this.registerForm.value;
      this.authService.register({ nom, email, password }).subscribe({
        next: (response) => {
          alert('Registration successful!');
          this.router.navigateByUrl(response.role === 'ADMIN' ? '/event' : '/reserve');
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Registration failed: ' + (err.error?.message || 'Error creating account'));
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
