// client.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { EventService, ClientDto } from '../core/event.service';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Name:</label>
        <input formControlName="nom" required>
      </div>
      <div>
        <label>Email:</label>
        <input type="email" formControlName="email" required>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" formControlName="password" required>
      </div>
      <button type="submit" [disabled]="clientForm.invalid">Add Client</button>
    </form>
  `
})
export class ClientComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.authService.isAdmin()) {
      alert('Only admins can add clients.');
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.clientForm.valid) {
      const newClient: ClientDto = this.clientForm.value;
      this.eventService.addClient(newClient).subscribe({
        next: res => {
          alert('Client added successfully!');
          this.clientForm.reset();
        },
        error: err => {
          console.error('Error details:', err);
          alert('Error adding client: ' + (err.status === 403 ? 'Only admins can add clients.' : err.message));
        }
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
