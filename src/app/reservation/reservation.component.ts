// src/app/components/reservation/reservation.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService, Event, ReservationDto } from '../core/event.service';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class ReservationComponent implements OnInit {
  events: Event[] = [];
  clientId: number | null = null;
  showReservationForm = false;
  reservationForm: FormGroup;
  selectedEventId: number | null = null;
  reservedEvents: ReservationDto[] = [];

  constructor(
    private eventService: EventService,
    protected authService: AuthService,
    protected router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      nomReservation: ['', Validators.required],
      description: [''],
      dateReservation: ['', Validators.required],
      place: [1, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => this.events = events,
      error: (err) => console.error('Error fetching events:', err)
    });
    this.getClientId().subscribe({
      next: (profile) => {
        this.clientId = profile.idClient;
        console.log('Client ID set to:', this.clientId); // Debug log
        if (this.authService.isClient() && this.authService.getToken()) {
          this.loadReservedEvents();
        }
      },
      error: (err) => console.error('Error fetching client ID:', err)
    });
  }

  loadReservedEvents(): void {
    if (this.clientId) {
      this.eventService.getReservedEvents(this.clientId).subscribe({
        next: (reservations: ReservationDto[]) => this.reservedEvents = reservations,
        error: (err) => console.error('Error fetching reserved events:', err)
      });
    } else {
      console.error('Client ID is null when loading reserved events');
    }
  }

  getClientId(): Observable<{ idClient: number }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken() || ''}`
    });
    return this.http.get<{ idClient: number }>('http://localhost:8081/api/v1/auth/me', { headers });
  }

  openReservationForm(eventId: number): void {
    if (!this.authService.isClient()) {
      alert('Only clients can reserve events.');
      this.router.navigateByUrl('/login');
      return;
    }
    this.selectedEventId = eventId;
    console.log('Selected Event ID:', this.selectedEventId);
    this.showReservationForm = true;
  }

  getEventTitle(idEvenement: number): string {
    const event = this.events.find(e => e.idEvenement === idEvenement);
    return event ? event.titre : 'Unknown Event';
  }

  getEventType(idEvenement: number): string {
    const event = this.events.find(e => e.idEvenement === idEvenement);
    return event ? event.type : 'Unknown Type';
  }

  reserve(): void {
    console.log('Attempting to reserve - clientId:', this.clientId, 'selectedEventId:', this.selectedEventId); // Debug log
    if (!this.clientId || !this.selectedEventId) {
      alert('Client ID or Event ID not available.');
      return;
    }
    if (this.reservationForm.valid) {
      const reservation: ReservationDto = {
        nomReservation: this.reservationForm.value.nomReservation,
        description: this.reservationForm.value.description,
        dateReservation: this.reservationForm.value.dateReservation,
        place: this.reservationForm.value.place,
        prix: this.reservationForm.value.prix,
        idClient: this.clientId,
        idEvenement: this.selectedEventId
      };
      console.log('Reservation data:', reservation); // Debug log
      this.eventService.reserveEvent(reservation).subscribe({
        next: (response) => {
          alert('Reservation added successfully!');
          this.reservationForm.reset();
          this.showReservationForm = false;
          this.loadReservedEvents();
        },
        error: (err) => {
          console.error('Error reserving event:', err);
          let errorMessage = 'Error reserving event.';
          if (err.status === 403) {
            errorMessage = 'Access denied. Please log in again.';
          } else if (err.status === 400 && err.error?.message?.includes('No places available')) {
            errorMessage = 'No places available for this event.';
          }
          alert(errorMessage);
        }
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
