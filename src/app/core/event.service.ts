// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No JWT token found. Some requests may fail due to authentication issues.');
    }
    return headers;
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/events`, { headers: this.getHeaders() });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/events`, { headers: this.getHeaders() });
  }

  createEvent(event: Event): Observable<Event> {
    const { reservations, ...eventWithoutReservations } = event;
    return this.http.post<Event>(`${this.apiUrl}/events/event`, eventWithoutReservations, { headers: this.getHeaders() });
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    const { reservations, ...eventWithoutReservations } = event;
    return this.http.put<Event>(`${this.apiUrl}/events/event/${id}`, eventWithoutReservations, { headers: this.getHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/event/${id}`, { headers: this.getHeaders() });
  }

  // Client-related methods
  addClient(client: ClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.apiUrl}/client/client`, client, { headers: this.getHeaders() });
  }

  getReservedEvents(clientId: number): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/reservations/getreservationbyid`, {
      headers: this.getHeaders(),
      params: { idClient: clientId.toString() }
    }).pipe(
      map(reservations => reservations.map(res => ({
        ...res,
        dateReservation: res.dateReservation ? new Date(res.dateReservation).toISOString().split('T')[0] : '' // Convert LocalDateTime to YYYY-MM-DD
      })))
    );
  }

  getClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${this.apiUrl}/client/clients`, { headers: this.getHeaders() });
  }

  // Reservation-related methods
  reserveEvent(reservation: ReservationDto): Observable<ReservationDto> {
    return this.http.post<ReservationDto>(`${this.apiUrl}/reservations/reserver`, reservation, { headers: this.getHeaders() });
  }
  getAllEventsByClientId(idClient:number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/events`, { headers: this.getHeaders() });
  }
}

// Interfaces
export interface Event {
  idEvenement: number;
  titre: string;
  type: string;
  nombrePlase: number;
  description: string;
  dateDebut: string;
  dateFin: string;
  reservations: Reservation[];
}

export interface Reservation {
  id: number;
  nomClient: string;
  emailClient: string;
}

export interface ClientDto {
  idClient?: number;
  nom: string;
  email: string;
  password: string;
}

export interface ReservationDto {
  idReservation?: number;
  nomReservation: string;
  description?: string;
  dateReservation: string; // Adjusted to string for YYYY-MM-DD
  place: number; // Adjusted to number, assuming String was a typo
  prix: number;
  idClient: number;
  idEvenement: number;
}
